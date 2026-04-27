"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";

const PROJECTS = [
  {
    title: "Christmas in Lagos",
    year: "2023",
    genre: "Comedy / Drama",
    videoId: "xRqW8OVvpmA",
    thumb: `https://img.youtube.com/vi/xRqW8OVvpmA/maxresdefault.jpg`,
  },
  {
    title: "Tali's Baby Diary",
    year: "2022",
    genre: "Comedy",
    videoId: "8TTxjakTV8E",
    thumb: `https://img.youtube.com/vi/8TTxjakTV8E/maxresdefault.jpg`,
  },
  {
    title: "The Shakedown",
    year: "2021",
    genre: "Thriller",
    videoId: "Z5aYSmBXYCY",
    thumb: `https://img.youtube.com/vi/Z5aYSmBXYCY/maxresdefault.jpg`,
  },
  {
    title: "The Pirates of Somalia",
    year: "2017",
    genre: "Drama / Biography",
    videoId: "Na7t_Kle9Hg",
    thumb: `https://img.youtube.com/vi/Na7t_Kle9Hg/maxresdefault.jpg`,
  },
  {
    title: "Fatal Seduction",
    year: "2023",
    genre: "Thriller / Drama",
    videoId: "6Dpi7CZHY84",
    thumb: `https://img.youtube.com/vi/6Dpi7CZHY84/maxresdefault.jpg`,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Work() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const activeProject = PROJECTS.find((p) => p.videoId === activeVideo);

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
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.videoId}
              variants={itemVariants}
              onClick={() => setActiveVideo(p.videoId)}
              className={`group relative overflow-hidden rounded-xl aspect-[16/10] cursor-pointer ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              {/* Thumbnail */}
              <Image
                src={p.thumb}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes={i === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                unoptimized
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-500" />

              {/* Gold shimmer on hover */}
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-all duration-500" />

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 z-10">
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mb-5 group-hover:border-gold group-hover:bg-gold/10 group-hover:scale-110 transition-all duration-300">
                  <Play
                    size={24}
                    className="text-white/80 group-hover:text-gold transition-colors ml-1"
                    fill="currentColor"
                  />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-white text-center mb-2 group-hover:text-gold transition-colors duration-300 drop-shadow-lg">
                  {p.title}
                </h3>
                <div className="flex items-center gap-3 text-neutral-300 text-sm drop-shadow">
                  <span>{p.year}</span>
                  <span className="w-1 h-1 rounded-full bg-gold/60" />
                  <span>{p.genre}</span>
                </div>
              </div>

              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gold/30 transition-all duration-300 z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveVideo(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-5xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center text-neutral-400 hover:text-gold transition-all"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

              {/* Title */}
              {activeProject && (
                <div className="mb-4">
                  <h3 className="font-display text-2xl text-gold">
                    {activeProject.title}
                  </h3>
                  <p className="text-neutral-500 text-sm">
                    {activeProject.year} &middot; {activeProject.genre}
                  </p>
                </div>
              )}

              {/* Video embed */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/50">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeProject?.title || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
