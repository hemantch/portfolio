"use client";

import { motion } from "motion/react";

const SKILLS = [
  "AWS", "Terraform", "Docker", "ECS / EKS",
  "Grafana", "CloudWatch", "Python", "CI / CD",
  "Linux", "Databases", "SLO / SLI", "FinOps",
];

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-[#0F0F18]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-accent text-xs tracking-[0.25em] uppercase">
            What I Know
          </span>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mt-3">
            Skills &amp; Expertise
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-5">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "backOut" }}
              className="group relative"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent/20 blur-md"
                style={{ clipPath: HEX }}
              />
              {/* Hex cell */}
              <div
                className="relative w-28 h-32 flex items-center justify-center bg-[#0A0A0F] border border-accent/15 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300 cursor-default"
                style={{ clipPath: HEX }}
              >
                <span className="font-syne font-bold text-white/60 group-hover:text-accent text-xs sm:text-sm text-center px-3 leading-tight transition-colors duration-300 select-none">
                  {skill}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
