"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/2 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center pt-24 lg:pt-0">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block text-gold text-sm tracking-[0.25em] uppercase mb-6 font-medium">
            Film & TV Production
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6">
            Bringing Stories{" "}
            <span className="gold-gradient-text">to Life</span> on a Global
            Stage
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mb-10 leading-relaxed">
            Irfaan Fredericks has had the opportunity to produce content on a
            global scale, cultivating a vast network of reliable partners across
            various regions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-gold inline-block">
              Let&apos;s Connect
            </a>
            <a href="#work" className="btn-gold-outline inline-block">
              View Work
            </a>
          </div>
        </motion.div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-[300px] mx-auto lg:max-w-none"
        >
          <Globe />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown className="text-gold/50" size={28} />
      </motion.div>
    </section>
  );
}
