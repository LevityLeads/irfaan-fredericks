"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TiltCard from "./TiltCard";
import CountryOutline from "./CountryOutlines";

const PARTNERS = [
  { country: "India", partner: "India Take One" },
  { country: "Saudi Arabia", partner: "Ideation Studios" },
  { country: "Nigeria", partner: "Greoh Studios" },
  { country: "South Africa", partner: "Wallflower Productions" },
  { country: "South Africa", partner: "After Dark Post Production" },
  { country: "Egypt", partner: "Asap Films" },
  { country: "United Kingdom", partner: "Precession Productions" },
];

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
                  <CountryOutline
                    country={p.country}
                    size={40}
                    className="text-gold/60 group-hover:text-gold transition-colors duration-300"
                  />
                  <ArrowUpRight
                    size={16}
                    className="text-neutral-600 group-hover:text-gold transition-colors"
                  />
                </div>
                <p className="text-gold/80 text-xs font-medium tracking-[0.2em] uppercase mb-1">
                  {p.country}
                </p>
                <h3 className="text-white font-semibold text-lg">{p.partner}</h3>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
