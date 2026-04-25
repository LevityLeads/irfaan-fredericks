"use client";

import { motion } from "framer-motion";

const QUESTIONS = [
  "Have you crafted a script that you believe is a masterpiece, yet struggle to capture interest or determine your next steps?",
  "Do you require assistance in developing a strategic action plan to bring your film into production?",
  "How can you effectively package your project and attract the right talent?",
  "Are you seeking guidance on locating financing options for your film?",
  "Do you need to produce your film within a specific budget and require help in achieving that?",
  "Would a one-hour consultation to navigate production challenges and avoid common pitfalls be beneficial?",
  "Have you completed a film and need advice on approaching the festival circuit, marketing, and distribution?",
];

export default function Questions() {
  return (
    <section className="py-24 lg:py-32 bg-[#111111] relative">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-gold/2 blur-[200px]" />

      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4">
            Is This <span className="gold-gradient-text">You</span>?
          </h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="space-y-6">
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border-l-2 border-gold/60 pl-6 py-2"
            >
              <p className="text-neutral-300 text-lg leading-relaxed">{q}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
