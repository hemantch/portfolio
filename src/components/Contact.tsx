"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass = [
    "font-inter w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3",
    "text-white placeholder-[#94A3B8] text-sm",
    "focus:outline-none focus:border-accent transition-colors duration-200",
  ].join(" ");

  return (
    <section id="contact" className="py-24 px-6 bg-[#0A0A0F]">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-inter text-accent text-xs tracking-[0.25em] uppercase">
            Let&apos;s Connect
          </span>
          <h2 className="font-syne font-black text-white mt-3" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Get In Touch
          </h2>
          <p className="font-inter text-[#94A3B8] mt-4 text-base">
            Open to interesting conversations and opportunities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-inter block text-[#94A3B8] text-sm mb-2 uppercase tracking-widest">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="font-inter block text-[#94A3B8] text-sm mb-2 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="font-inter block text-[#94A3B8] text-sm mb-2 uppercase tracking-widest">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="What's on your mind?"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="font-inter font-semibold w-full py-3 border border-[#00D4FF] text-[#00D4FF] bg-transparent rounded-lg hover:bg-[#00D4FF] hover:text-[#0A0A0F] transition-colors duration-200 cursor-pointer text-sm"
            >
              {sent ? "✓ Message Sent!" : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        <div className="font-inter text-center mt-12 text-white/20 text-xs">
          © {new Date().getFullYear()} Hemanth Chappa · Glasgow, UK
        </div>
      </div>
    </section>
  );
}
