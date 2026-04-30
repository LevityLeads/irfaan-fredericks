"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // SplitText on the heading
      if (headingRef.current) {
        const split = SplitText.create(headingRef.current, {
          type: "chars,words",
          charsClass: "char",
        });

        gsap.from(split.chars, {
          opacity: 0,
          y: 40,
          rotateX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.4,
        });
      }

      // Parallax on background glows
      if (glow1Ref.current) {
        gsap.to(glow1Ref.current, {
          y: -120,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (glow2Ref.current) {
        gsap.to(glow2Ref.current, {
          y: -80,
          x: 60,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    },
    { scope: heroRef }
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient background glow - parallax controlled by GSAP */}
      <div
        ref={glow1Ref}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[150px]"
      />
      <div
        ref={glow2Ref}
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/2 blur-[120px]"
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center pt-24 lg:pt-0">
        {/* Text */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="inline-block text-gold text-sm tracking-[0.25em] uppercase mb-6 font-medium"
          >
            Film &amp; TV Production
          </motion.span>
          <h1
            ref={headingRef}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6"
            style={{ perspective: "400px" }}
          >
            Bringing Stories{" "}
            <span className="gold-gradient-text">to Life</span> on a Global
            Stage
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="text-neutral-400 text-lg max-w-xl mb-10 leading-relaxed"
          >
            Irfaan Fredericks has had the opportunity to produce content on a
            global scale, cultivating a vast network of reliable partners across
            various regions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <a href="#contact" className="btn-gold inline-block">
              Let&apos;s Connect
            </a>
            <a href="#work" className="btn-gold-outline inline-block">
              View Work
            </a>
          </motion.div>
        </div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-[300px] mx-auto lg:max-w-none"
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
