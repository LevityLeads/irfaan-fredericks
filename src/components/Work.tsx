"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const PROJECTS = [
  {
    title: "Christmas in Lagos",
    year: "2023",
    genre: "Comedy / Drama",
    videoId: "xRqW8OVvpmA",
    thumb: "https://img.youtube.com/vi/xRqW8OVvpmA/maxresdefault.jpg",
  },
  {
    title: "Tali's Baby Diary",
    year: "2022",
    genre: "Comedy",
    videoId: "8TTxjakTV8E",
    thumb: "https://img.youtube.com/vi/8TTxjakTV8E/maxresdefault.jpg",
  },
  {
    title: "The Shakedown",
    year: "2021",
    genre: "Thriller",
    videoId: "Z5aYSmBXYCY",
    thumb: "https://img.youtube.com/vi/Z5aYSmBXYCY/maxresdefault.jpg",
  },
  {
    title: "The Pirates of Somalia",
    year: "2017",
    genre: "Drama / Biography",
    videoId: "Na7t_Kle9Hg",
    thumb: "https://img.youtube.com/vi/Na7t_Kle9Hg/maxresdefault.jpg",
  },
  {
    title: "Fatal Seduction",
    year: "2023",
    genre: "Thriller / Drama",
    videoId: "6Dpi7CZHY84",
    thumb: "https://img.youtube.com/vi/6Dpi7CZHY84/maxresdefault.jpg",
  },
];

function getCardStyle(index: number, active: number, total: number) {
  const diff = index - active;
  const absDiff = Math.abs(diff);

  if (absDiff > 2) {
    return { scale: 0.7, x: diff * 120, opacity: 0, zIndex: 0 };
  }

  const scale = absDiff === 0 ? 1 : absDiff === 1 ? 0.88 : 0.78;
  const opacity = absDiff === 0 ? 1 : absDiff === 1 ? 0.5 : 0.25;
  const xOffset = diff * 280;
  const zIndex = total - absDiff;

  return { scale, x: xOffset, opacity, zIndex };
}

export default function Work() {
  const [active, setActive] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const activeProject = PROJECTS.find((p) => p.videoId === activeVideo);
  const touchStart = useRef<number | null>(null);

  const goTo = useCallback(
    (dir: number) => {
      setActive((prev) => {
        const next = prev + dir;
        if (next < 0) return PROJECTS.length - 1;
        if (next >= PROJECTS.length) return 0;
        return next;
      });
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeVideo) return;
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, activeVideo]);

  return (
    <section id="work" className="py-24 lg:py-32 bg-[#111111] relative overflow-hidden">
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
      </div>

      {/* Carousel */}
      <div
        className="relative w-full"
        style={{ height: 380, perspective: 1200 }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const diff = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(diff) > 40) goTo(diff < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {PROJECTS.map((p, i) => {
            const style = getCardStyle(i, active, PROJECTS.length);
            const isActive = i === active;

            return (
              <motion.div
                key={p.videoId}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  opacity: style.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{ zIndex: style.zIndex }}
                className="absolute w-[320px] sm:w-[480px] lg:w-[580px] cursor-pointer"
                onClick={() => {
                  if (isActive) {
                    setActiveVideo(p.videoId);
                  } else {
                    setActive(i);
                  }
                }}
              >
                <div
                  className={`relative aspect-video rounded-xl overflow-hidden group ${
                    isActive
                      ? "shadow-2xl shadow-gold/20 ring-1 ring-gold/30"
                      : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <Image
                    src={p.thumb}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="580px"
                    unoptimized
                  />

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      isActive
                        ? "bg-black/30 group-hover:bg-black/20"
                        : "bg-black/60"
                    }`}
                  />

                  {/* Play button + info */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center mb-4 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300"
                      >
                        <Play
                          size={24}
                          className="text-white/80 group-hover:text-gold transition-colors ml-1"
                          fill="currentColor"
                        />
                      </motion.div>
                    )}
                    <h3
                      className={`font-display text-center transition-colors duration-300 drop-shadow-lg ${
                        isActive
                          ? "text-xl sm:text-2xl text-white group-hover:text-gold"
                          : "text-lg text-white/70"
                      }`}
                    >
                      {p.title}
                    </h3>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-neutral-300 text-sm mt-2 drop-shadow"
                      >
                        <span>{p.year}</span>
                        <span className="w-1 h-1 rounded-full bg-gold/60" />
                        <span>{p.genre}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => goTo(-1)}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-gold/20 flex items-center justify-center text-gold/70 hover:text-gold hover:border-gold/50 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => goTo(1)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-gold/20 flex items-center justify-center text-gold/70 hover:text-gold hover:border-gold/50 transition-all"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`transition-all duration-300 rounded-full ${
              i === active
                ? "w-8 h-2 bg-gold"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
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
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-5xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center text-neutral-400 hover:text-gold transition-all"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

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
