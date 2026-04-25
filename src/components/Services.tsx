"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Rocket,
  Film,
  Building2,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const SERVICES = [
  {
    icon: Clock,
    title: "Standard",
    description:
      "After an initial discussion of your specific project needs, book hourly sessions. Hourly consultations are ideal for specific issues.",
    bullets: [
      "Problem-solving",
      "Putting out production fires",
      "Mid-production game changers",
    ],
    note: "Short lead-time. No follow-up.",
  },
  {
    icon: Rocket,
    title: "Career Jump Start",
    description:
      "Are you stuck in a rut? Are you not where you want to be with your career in entertainment whether you are an Actor, Writer, Director, Producer or any other filmmaker?",
    bullets: [
      "Discuss your situation",
      "Get specific tips",
      "Get yourself more visible in the game",
    ],
    note: "Regular rates.",
  },
  {
    icon: Film,
    title: "Production Planning & Mentoring",
    description:
      "Irfaan Fredericks reads and analyzes your script, discusses a clear understanding of what you want to achieve, and guides you with a realistic action plan.",
    bullets: [
      "In-depth planning solutions",
      "Specifics in financing",
      "Casting ideas",
      "Packaging a project",
      "Creating an action plan",
      "Finding industry contacts & crew",
      "Problem-solving strategies",
      "Correcting production problems",
    ],
    note: "Quotes based on project scope.",
  },
  {
    icon: Building2,
    title: "Enterprise B2B",
    description:
      "Advising on rights acquisition, financing, production, and distribution to optimize operations, maximize revenue, and navigate industry challenges.",
    bullets: [],
    note: null,
  },
  {
    icon: Briefcase,
    title: "Project-Based",
    description:
      "Signing on to oversee a feature film or series and steer it toward completion and success on a long-term basis.",
    bullets: ["Executive Producer", "Producer", "Project Supervisor"],
    note: "Quotes based on project scope.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4">
            <span className="gold-gradient-text">Services</span>
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-neutral-400 text-lg max-w-2xl">
            Tailored consulting for every stage of your production journey.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className={`glass-card rounded-xl p-8 flex flex-col ${
                  i === 2 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">
                  {s.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-5 flex-grow">
                  {s.description}
                </p>
                {s.bullets.length > 0 && (
                  <div className="space-y-2 mb-5">
                    {s.bullets.map((b) => (
                      <div
                        key={b}
                        className="flex items-start gap-2 text-neutral-300 text-sm"
                      >
                        <CheckCircle
                          size={14}
                          className="text-gold/70 shrink-0 mt-0.5"
                        />
                        {b}
                      </div>
                    ))}
                  </div>
                )}
                {s.note && (
                  <p className="text-neutral-500 text-xs mb-5 italic">
                    {s.note}
                  </p>
                )}
                <a
                  href="#contact"
                  className="btn-gold text-center text-sm mt-auto"
                >
                  Get Started
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
