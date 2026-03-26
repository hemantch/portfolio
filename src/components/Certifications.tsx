"use client";

import { motion } from "motion/react";

function OracleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}
function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" d="M6.5 19a4.5 4.5 0 01-.5-9 6 6 0 0111.8-1A4 4 0 0119 17.5" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function ArchitectIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3"  y="3"  width="7" height="7" rx="1" />
      <rect x="14" y="3"  width="7" height="7" rx="1" />
      <rect x="3"  y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3.5v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10v-5L12 2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="9 12 11 14 15 10" />
    </svg>
  );
}

const CERTS = [
  { name: "Oracle Certified Associate",                   org: "Oracle",              icon: <OracleIcon />    },
  { name: "AWS Certified Cloud Practitioner",             org: "Amazon Web Services", icon: <CloudIcon />     },
  { name: "AWS Certified Developer Associate",            org: "Amazon Web Services", icon: <CodeIcon />      },
  { name: "AWS Certified Solutions Architect Associate",  org: "Amazon Web Services", icon: <ArchitectIcon /> },
  { name: "AWS Certified SysOps Administrator Associate", org: "Amazon Web Services", icon: <ShieldIcon />    },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 bg-[#0F0F18]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-accent text-xs tracking-[0.25em] uppercase">
            Credentials
          </span>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mt-3">
            Certifications
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTS.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative bg-[#0A0A0F] border border-white/5 group-hover:border-highlight/40 rounded-xl p-6 h-full transition-all duration-300">
                {/* Gold shimmer sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-highlight/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                <div className="text-white/30 group-hover:text-highlight transition-colors duration-300 mb-4">
                  {cert.icon}
                </div>

                <h3 className="font-syne font-bold text-white text-sm leading-snug">
                  {cert.name}
                </h3>
                <p className="font-inter text-white/35 text-xs mt-2">{cert.org}</p>

                {/* Corner badge dot */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-highlight/50 group-hover:bg-highlight group-hover:shadow-[0_0_8px_rgba(245,166,35,0.6)] transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
