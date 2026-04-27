"use client";

const ITEMS = [
  "FILM PRODUCTION",
  "ENTERTAINMENT STRATEGY",
  "GLOBAL NETWORK",
  "50+ PRODUCTIONS",
  "6 COUNTRIES",
  "PRE-PRODUCTION",
  "POST-PRODUCTION",
  "CONTENT CREATION",
  "STRATEGIC ADVISORY",
];

export default function Marquee() {
  const separator = (
    <span className="mx-8 text-gold/30 text-xs">&#9670;</span>
  );

  return (
    <div className="relative overflow-hidden py-6 border-y border-gold/10 bg-[#0A0A0A]">
      <div className="marquee-track flex whitespace-nowrap">
        {[...Array(2)].map((_, rep) => (
          <div key={rep} className="flex items-center shrink-0 marquee-content">
            {ITEMS.map((item, i) => (
              <span key={`${rep}-${i}`} className="flex items-center">
                <span className="text-gold/20 text-sm font-display tracking-[0.3em] uppercase">
                  {item}
                </span>
                {separator}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
