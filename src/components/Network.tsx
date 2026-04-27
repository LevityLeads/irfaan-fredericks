"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import TiltCard from "./TiltCard";

const PARTNERS = [
  { country: "India", flag: "\u{1F1EE}\u{1F1F3}", partner: "India Take One" },
  { country: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}", partner: "Ideation Studios" },
  { country: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", partner: "Greoh Studios" },
  { country: "South Africa", flag: "\u{1F1FF}\u{1F1E6}", partner: "Wallflower Productions" },
  { country: "South Africa", flag: "\u{1F1FF}\u{1F1E6}", partner: "After Dark Post Production" },
  { country: "Egypt", flag: "\u{1F1EA}\u{1F1EC}", partner: "Asap Films" },
  { country: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", partner: "Precession Productions" },
];

const SERVICES = ["Pre-Production", "Production", "Post-Production"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Network() {
  return (
    <section id="network" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4">
            Global <span className="gold-gradient-text">Network</span>
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-neutral-400 text-lg max-w-2xl">
            Production partners across 6 countries, providing end-to-end
            capabilities from pre-production through post.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {PARTNERS.map((p, i) => (
            <motion.div key={i} variants={item}>
              <TiltCard className="glass-card rounded-xl p-6 group h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-2xl mr-2">{p.flag}</span>
                    <span className="text-gold text-sm font-medium tracking-wide uppercase">
                      {p.country}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-neutral-600 group-hover:text-gold transition-colors"
                  />
                </div>
                <h3 className="text-white font-semibold text-lg mb-4">{p.partner}</h3>
                <div className="space-y-2">
                  {SERVICES.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-neutral-400 text-sm">
                      <CheckCircle size={14} className="text-gold/70 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
