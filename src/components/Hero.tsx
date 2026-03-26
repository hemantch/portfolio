"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const PARTICLE_COUNT = 80;
const MAX_DIST = 130;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
}

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 1.5 + 0.8,
  };
}

const TITLES = [
  "Site Reliability Engineer",
  "Platform Engineer",
  "Cloud Infrastructure Expert",
  "Distributed Systems Builder",
];

export default function Hero() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef       = useRef<number>(0);

  const [titleIdx,  setTitleIdx]  = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting,  setDeleting]  = useState(false);

  // Canvas particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        makeParticle(canvas.width, canvas.height)
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particlesRef.current;

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.65)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "#0A0A0F" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/10 to-[#0A0A0F] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-inter text-accent text-xs tracking-[0.25em] uppercase mb-6"
        >
          Glasgow, UK · SRE · 9 Years Experience
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-syne font-black text-6xl sm:text-7xl md:text-8xl mb-6"
          style={{ letterSpacing: "-0.04em", lineHeight: "0.9", color: "#F0F0F0" }}
        >
          Hemanth
          <br />
          Chappa
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="font-syne font-semibold text-xl sm:text-2xl md:text-3xl text-white/85 mb-4 h-10 flex items-center justify-center"
        >
          <span>{displayed}</span>
          <span className="ml-1 inline-block w-0.5 h-7 bg-accent animate-pulse" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="font-inter text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-10"
        >
          Building scalable, fault-tolerant systems at global scale
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#experience"
            className="font-inter font-semibold px-8 py-3.5 bg-accent text-black rounded hover:bg-accent/85 transition-colors duration-200"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="font-inter font-semibold px-8 py-3.5 border border-accent text-accent rounded hover:bg-accent/10 transition-colors duration-200"
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
