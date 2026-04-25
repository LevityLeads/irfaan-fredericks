"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gold/4 blur-[150px]" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6">
            Ready to Bring Your{" "}
            <span className="gold-gradient-text">Vision</span> to Life?
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            A consultation begins with a complimentary 15-minute discussion
            about your project or career, paving the way for tailored support
            moving forward.
          </p>
          <a
            href="mailto:contact@irfaanfredericks.com"
            className="btn-gold inline-block text-lg px-10 py-4"
          >
            Book a Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
