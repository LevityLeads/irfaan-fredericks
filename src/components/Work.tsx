"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const PROJECTS = [
  {
    title: "Christmas in Lagos",
    year: "2023",
    genre: "Comedy / Drama",
  },
  {
    title: "Tali's Baby Diary",
    year: "2022",
    genre: "Comedy",
  },
  {
    title: "The Shakedown",
    year: "2021",
    genre: "Thriller",
  },
  {
    title: "The Pirates of Somalia",
    year: "2017",
    genre: "Drama / Biography",
  },
  {
    title: "Fatal Seduction",
    year: "2023",
    genre: "Thriller / Drama",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Work() {
  return (
    <section id="work" className="py-24 lg:py-32 bg-[#111111] relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4">
            Selected <span className="gold-gradient-text">Work</span>
          </h2>
          <div className="gold-divider" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              variants={item}
              className={`group relative overflow-hidden rounded-xl aspect-[16/10] cursor-pointer ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              {/* Cinematic gradient background */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: `linear-gradient(${135 + i * 30}deg, #1a1510 0%, #0d0b08 40%, #111 100%)`,
                }}
              />

              {/* Film strip border effect */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-[#0A0A0A] flex items-center gap-2 px-3">
                {Array.from({ length: 12 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-3 h-2 rounded-sm bg-neutral-800"
                  />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0A0A0A] flex items-center gap-2 px-3">
                {Array.from({ length: 12 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-3 h-2 rounded-sm bg-neutral-800"
                  />
                ))}
              </div>

              {/* Gold overlay on hover */}
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-all duration-500" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8">
                <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold/60 group-hover:bg-gold/10 transition-all duration-300">
                  <Play
                    size={20}
                    className="text-gold/60 group-hover:text-gold transition-colors ml-0.5"
                  />
                </div>
                <h3 className="font-display text-2xl text-white text-center mb-2 group-hover:text-gold transition-colors duration-300">
                  {p.title}
                </h3>
                <div className="flex items-center gap-3 text-neutral-500 text-sm">
                  <span>{p.year}</span>
                  <span className="w-1 h-1 rounded-full bg-gold/40" />
                  <span>{p.genre}</span>
                </div>
              </div>

              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/30 transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
