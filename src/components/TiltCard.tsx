"use client";

import { useRef, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const maxDeg = 14;
    const rotateX = (y - 0.5) * -maxDeg * 2;
    const rotateY = (x - 0.5) * maxDeg * 2;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    card.style.boxShadow = `${rotateY * 3}px ${rotateX * 3}px 40px rgba(201, 168, 76, 0.15)`;
  }, []);

  const handleLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    card.style.boxShadow = "none";
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        willChange: "transform",
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {children}
    </div>
  );
}
