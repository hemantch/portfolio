export interface Env {
  CACHE: KVNamespace;
  PORTFOLIO_INDEX: VectorizeIndex;
  AI: Ai;
  PORTFOLIO_ANALYTICS: AnalyticsEngineDataset;
  GROQ_API_KEY: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://hemanthchappa.com",
  "https://www.hemanthchappa.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const EMBEDDING_MODEL = "@cf/baai/bge-small-en-v1.5"; // 384-dim, matches PORTFOLIO_INDEX
const CHAT_MODEL = "llama-3.1-8b-instant";
const RATE_LIMIT_PER_MINUTE = 10;

function corsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://hemanthchappa.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  const bucket = Math.floor(Date.now() / 60_000); // one bucket per minute
  const key = `ratelimit:${ip}:${bucket}`;
  const current = await env.CACHE.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= RATE_LIMIT_PER_MINUTE) {
    return false;
  }

  await env.CACHE.put(key, String(count + 1), { expirationTtl: 120 });
  return true;
}

async function handleChat(request: Request, env: Env, ctx: ExecutionContext, origin: string | null): Promise<Response> {
  let body: { question?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, origin);
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return json({ error: "`question` is required" }, 400, origin);
  }

  const tStart = Date.now();

  const embedding = await env.AI.run(EMBEDDING_MODEL, { text: [question] });
  const vector = "data" in embedding ? embedding.data?.[0] : undefined;
  if (!vector) {
    return json({ error: "Embedding model did not return a vector" }, 502, origin);
  }

  const matches = await env.PORTFOLIO_INDEX.query(vector, { topK: 5, returnMetadata: true });
  const retrievalLatencyMs = Date.now() - tStart;

  const contextChunks = matches.matches.map((m) => (m.metadata?.text as string) ?? "");
  const sources = matches.matches
    .map((m) => {
      const source = m.metadata?.source as string | undefined;
      const section = m.metadata?.section as string | undefined;
      if (!source) return null;
      return section ? `${source} § ${section}` : source;
    })
    .filter((s): s is string => Boolean(s));

  const retrievedChunks = matches.matches.map((m) => ({
    source: (m.metadata?.source as string) ?? m.id,
    section: (m.metadata?.section as string) ?? "",
    score: Math.round(m.score * 10000) / 10000,
  }));

  const context = contextChunks.filter(Boolean).join("\n\n---\n\n");

  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You answer questions about Hemanth Chappa using only the provided context. " +
            "If the context doesn't contain the answer, say you don't have that information.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!groqResponse.ok) {
    const errText = await groqResponse.text();
    return json({ error: "Upstream chat completion failed", detail: errText }, 502, origin);
  }

  const groqData = await groqResponse.json<{
    choices: { message: { content: string } }[];
  }>();
  const answer = groqData.choices[0]?.message?.content ?? "";
  const totalLatencyMs = Date.now() - tStart;

  ctx.waitUntil(
    Promise.resolve(
      env.PORTFOLIO_ANALYTICS.writeDataPoint({
        blobs: [question, answer.slice(0, 200)],
        doubles: [sources.length, totalLatencyMs],
        indexes: ["chat"],
      })
    )
  );

  return json(
    {
      answer,
      sources,
      model: CHAT_MODEL,
      retrievalLatencyMs,
      totalLatencyMs,
      matches: retrievedChunks,
    },
    200,
    origin
  );
}

async function handleStats(_env: Env, origin: string | null): Promise<Response> {
  // The Analytics Engine binding only supports writes (writeDataPoint).
  // Reading aggregates back out requires the Analytics Engine SQL API
  // (https://api.cloudflare.com/.../analytics_engine/sql) with an account id
  // + API token, which isn't wired up yet. Returning a stub until that's added.
  return json(
    {
      message: "stats endpoint not yet wired to Analytics Engine SQL API",
    },
    501,
    origin
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const withinLimit = await checkRateLimit(env, ip);
    if (!withinLimit) {
      return json({ error: "Rate limit exceeded. Try again in a minute." }, 429, origin);
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChat(request, env, ctx, origin);
    }

    if (url.pathname === "/api/stats" && request.method === "GET") {
      return handleStats(env, origin);
    }

    return json({ error: "Not found" }, 404, origin);
  },
} satisfies ExportedHandler<Env>;
