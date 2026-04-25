"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [20.5937, 78.9629], size: 0.08 },
  { location: [23.8859, 45.0792], size: 0.08 },
  { location: [9.082, 8.6753], size: 0.08 },
  { location: [-30.5595, 22.9375], size: 0.08 },
  { location: [26.8206, 30.8025], size: 0.08 },
  { location: [55.3781, -3.436], size: 0.08 },
];

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const frameRef = useRef<number>(0);

  const onResize = useCallback(() => {
    if (canvasRef.current && globeRef.current) {
      const w = canvasRef.current.offsetWidth;
      globeRef.current.update({
        width: w * 2,
        height: w * 2,
      });
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.offsetWidth;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 4,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.79, 0.66, 0.3],
      glowColor: [0.18, 0.15, 0.08],
      markers: MARKERS,
    });

    globeRef.current = globe;

    // Animation loop
    const animate = () => {
      if (!pointerInteracting.current) {
        phiRef.current += 0.003;
      }
      globe.update({
        phi: phiRef.current + pointerInteractionMovement.current,
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", onResize);

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);

    return () => {
      cancelAnimationFrame(frameRef.current);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
      {/* Gold glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-gold/5 blur-3xl scale-75" />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
