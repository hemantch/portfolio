"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "motion/react";
import Image from "next/image";

const STATS = [
  { value: 9,  suffix: "+", label: "Years Experience"   },
  { value: 3,  suffix: "",  label: "AWS Certifications" },
  { value: 2,  suffix: "",  label: "Companies at Scale" },
];

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = 60;
    const id = setInterval(() => {
      frame++;
      setCount(Math.round((frame / total) * target));
      if (frame >= total) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [active, target]);

  return <span>{count}{suffix}</span>;
}

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section id="about" className="py-24 px-6 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-accent text-xs tracking-[0.25em] uppercase">
            About Me
          </span>
          <h2 className="font-syne font-black text-white mt-3" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            About Me
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Photo with circular frame */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            {/* Photo */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-[#00D4FF]/40 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
              <Image
                src="/1725520706842.jpeg"
                alt="Hemanth Chappa"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>

          {/* Bio + stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-inter text-white/65 text-lg leading-relaxed">
              I&apos;ve spent 9 years doing the thing most people take
              for granted — making sure the infrastructure just works.
              From AWS support to platform engineering at JPMorganChase,
              I&apos;ve built systems that stay up when everything else is
              falling apart. When I&apos;m not thinking about uptime, I&apos;m
              travelling somewhere new or in the gym. Balance matters
              — in systems and in life.
            </p>

            <div ref={ref} className="grid grid-cols-3 gap-4 mt-10">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="text-center p-5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/20 transition-colors duration-300"
                >
                  <div className="font-syne font-extrabold text-3xl text-accent">
                    <Counter target={s.value} suffix={s.suffix} active={inView} />
                  </div>
                  <div className="font-inter text-white/45 text-xs mt-1.5 leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
