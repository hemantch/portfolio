"use client";

import { motion } from "motion/react";

const EXPERIENCES = [
  {
    title:    "Site Reliability Engineer",
    company:  "JPMorganChase",
    location: "Glasgow, Scotland, UK",
    period:   "Jan 2022 – Present",
    current:  true,
    highlights: [
      "Designed platform monitoring and alerting using Grafana and CloudWatch",
      "Established platform-level SLOs and SLIs",
      "Developed comprehensive dashboards for key performance metrics",
      "Architected stable solutions with product and engineering teams",
    ],
  },
  {
    title:    "Cloud Support Engineer",
    company:  "Amazon Web Services",
    location: "",
    period:   "Nov 2019 – Dec 2021",
    current:  false,
    highlights: [
      "Support for ECS, EKS, Elastic Beanstalk, CloudFormation",
      "Developer tools: CodeCommit, CodeBuild, CodeDeploy, CodePipeline",
      "Deep expertise in EC2, IAM, Lambda, SNS, RDS, S3, VPC",
    ],
  },
  {
    title:    "Senior Analyst",
    company:  "HCL Technologies",
    location: "",
    period:   "Feb 2017 – Nov 2019",
    current:  false,
    highlights: [
      "Oracle Database Administration for Elsevier",
      "System administration on Solaris and RHEL",
      "Performance tuning and database optimisation",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-[#0A0A0F]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-accent text-xs tracking-[0.25em] uppercase">
            My Journey
          </span>
          <h2 className="font-syne font-bold text-4xl md:text-5xl text-white mt-3">
            Work Experience
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Glowing centre line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent hidden md:block" />

          <div className="space-y-12">
            {EXPERIENCES.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="relative md:flex md:items-center">
                  {/* Timeline dot */}
                  <div
                    className="hidden md:block absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-2 border-[#0A0A0F] z-10"
                    style={{ boxShadow: "0 0 14px rgba(0,212,255,0.9)" }}
                  />

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
                  >
                    <div className="bg-[#0F0F18] border border-white/5 hover:border-accent/25 rounded-xl p-6 transition-colors duration-300">
                      {exp.current && (
                        <span className="font-inter inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-accent/10 text-accent text-xs rounded border border-accent/20 mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Current Role
                        </span>
                      )}
                      <h3 className="font-syne font-bold text-lg text-white">
                        {exp.title}
                      </h3>
                      <p className="font-syne font-semibold text-accent text-sm mt-0.5">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="font-inter text-white/35 text-xs mt-1">{exp.location}</p>
                      )}
                      <p className="font-inter text-white/35 text-xs mt-0.5">{exp.period}</p>

                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="font-inter text-white/55 text-sm flex items-start gap-2">
                            <span className="text-accent shrink-0 mt-0.5">▸</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
