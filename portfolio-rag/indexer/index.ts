import { config as loadEnv } from "dotenv";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORPUS_DIR = path.join(__dirname, "..", "corpus");

// Deliberately not `.env` — wrangler auto-loads `.env` in this directory and
// would try to authenticate deploy/secret commands with this scoped token
// instead of the OAuth login, which lacks Workers permissions.
loadEnv({ path: path.join(__dirname, "..", ".env.indexer") });

// Must match the `index_name` for the PORTFOLIO_INDEX binding in wrangler.toml
const VECTORIZE_INDEX = "portfolio-index";
const EMBEDDING_MODEL = "@cf/baai/bge-small-en-v1.5"; // 384-dim
const EMBED_BATCH_SIZE = 20;
const UPSERT_BATCH_SIZE = 200;
const MAX_METADATA_TEXT_LENGTH = 3500; // keep vector metadata well under Vectorize's per-vector limit

interface Chunk {
  source: string;
  section: string;
  text: string;
  hash: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function chunkMarkdown(content: string, source: string): Chunk[] {
  const lines = content.split("\n");
  const rawChunks: { section: string | null; lines: string[] }[] = [];
  let current: { section: string | null; lines: string[] } = { section: null, lines: [] };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      rawChunks.push(current);
      current = { section: line.replace(/^##\s+/, "").trim(), lines: [] };
    }
    current.lines.push(line);
  }
  rawChunks.push(current);

  return rawChunks
    .map(({ section, lines }) => {
      const text = lines.join("\n").trim();
      return { section: section ?? "Overview", text };
    })
    .filter(({ text }) => text.length > 0)
    .map(({ section, text }) => ({
      source,
      section,
      text,
      hash: createHash("sha256").update(text).digest("hex"),
    }));
}

async function loadCorpus(): Promise<Chunk[]> {
  const files = (await readdir(CORPUS_DIR)).filter((f) => f.endsWith(".md"));
  const chunks: Chunk[] = [];

  for (const file of files) {
    const content = await readFile(path.join(CORPUS_DIR, file), "utf-8");
    chunks.push(...chunkMarkdown(content, file));
  }

  return chunks;
}

function batches<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

async function embedChunks(
  chunks: Chunk[],
  accountId: string,
  apiToken: string
): Promise<number[][]> {
  const vectors: number[][] = [];

  for (const batch of batches(chunks, EMBED_BATCH_SIZE)) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${EMBEDDING_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: batch.map((c) => c.text) }),
      }
    );

    if (!res.ok) {
      throw new Error(`Embedding request failed (${res.status}): ${await res.text()}`);
    }

    const json = (await res.json()) as {
      success: boolean;
      result?: { data?: number[][] };
      errors?: unknown;
    };

    if (!json.success || !json.result?.data) {
      throw new Error(`Embedding response missing data: ${JSON.stringify(json)}`);
    }

    vectors.push(...json.result.data);
  }

  return vectors;
}

async function upsertVectors(
  chunks: Chunk[],
  vectors: number[][],
  accountId: string,
  apiToken: string
): Promise<number> {
  const records = chunks.map((chunk, i) => ({
    id: `${slugify(chunk.source)}--${chunk.hash.slice(0, 16)}`,
    values: vectors[i],
    metadata: {
      source: chunk.source,
      section: chunk.section,
      hash: chunk.hash,
      text: chunk.text.slice(0, MAX_METADATA_TEXT_LENGTH),
    },
  }));

  let upserted = 0;

  for (const batch of batches(records, UPSERT_BATCH_SIZE)) {
    const ndjson = batch.map((r) => JSON.stringify(r)).join("\n");

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${VECTORIZE_INDEX}/upsert`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/x-ndjson",
        },
        body: ndjson,
      }
    );

    if (!res.ok) {
      throw new Error(`Vectorize upsert failed (${res.status}): ${await res.text()}`);
    }

    const json = (await res.json()) as { success: boolean; result?: { mutationId?: string } };
    if (!json.success) {
      throw new Error(`Vectorize upsert response reported failure: ${JSON.stringify(json)}`);
    }

    upserted += batch.length;
  }

  return upserted;
}

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.error(
      "Missing CLOUDFLARE_ACCOUNT_ID and/or CLOUDFLARE_API_TOKEN. Set them in portfolio-rag/.env.indexer (see .env.indexer.example)."
    );
    process.exit(1);
  }

  const chunks = await loadCorpus();
  console.log(`Read ${new Set(chunks.map((c) => c.source)).size} corpus files, created ${chunks.length} chunks.`);

  const vectors = await embedChunks(chunks, accountId, apiToken);
  console.log(`Embedded ${vectors.length} chunks via ${EMBEDDING_MODEL}.`);

  const upserted = await upsertVectors(chunks, vectors, accountId, apiToken);
  console.log(`Upserted ${upserted} vectors into Vectorize index "${VECTORIZE_INDEX}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
