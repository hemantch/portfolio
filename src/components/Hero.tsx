"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DottedSurface } from "@/components/ui/dotted-surface";

const TITLES = [
  "Site Reliability Engineer",
  "Platform Engineer",
  "Cloud Architect",
  "Infrastructure Obsessive",
];

export default function Hero() {
  const [titleIdx,  setTitleIdx]  = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting,  setDeleting]  = useState(false);

  // Typewriter
  useEffect(() => {
    const full = TITLES[titleIdx];
    let id: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < full.length) {
      id = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === full.length) {
      id = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      id = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % TITLES.length);
    }

    return () => clearTimeout(id);
  }, [displayed, deleting, titleIdx]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <DottedSurface />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/10 to-[#0A0A0F] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-inter text-accent text-xs tracking-[0.25em] uppercase mb-10 inline-block border border-[#00D4FF]/20 bg-[#00D4FF]/5 rounded-full px-4 py-1.5"
        >
          Glasgow, UK · SRE · 9 Years Experience
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-syne font-black mb-10"
          style={{ fontSize: "clamp(1.8rem, 6vw, 4rem)", letterSpacing: "-0.01em", lineHeight: "0.9", color: "#F0F0F0" }}
        >
          Hemanth
          <br />
          Chappa
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="font-inter font-medium text-lg sm:text-xl text-muted mb-8 h-10 flex items-center justify-center"
        >
          <span>{displayed}</span>
          <span className="ml-1 inline-block w-0.5 h-6 bg-muted animate-pulse" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="font-inter text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-14"
        >
          Infrastructure is where I live — not just what I do.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#experience"
            className="font-inter font-semibold px-8 py-3.5 border border-accent text-accent rounded hover:bg-accent hover:text-[#0A0A0F] transition-colors duration-200 cursor-pointer"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="font-inter font-semibold px-8 py-3.5 border border-accent text-accent rounded hover:bg-accent hover:text-[#0A0A0F] transition-colors duration-200 cursor-pointer"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-inter text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
