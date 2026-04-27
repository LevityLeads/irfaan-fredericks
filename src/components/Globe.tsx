"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import createGlobe from "cobe";

interface MarkerData {
  location: [number, number];
  size: number;
  country: string;
  partner: string;
}

const MARKERS: MarkerData[] = [
  { location: [20.5937, 78.9629], size: 0.07, country: "India", partner: "India Take One" },
  { location: [23.8859, 45.0792], size: 0.07, country: "Saudi Arabia", partner: "Ideation Studios" },
  { location: [9.082, 8.6753], size: 0.07, country: "Nigeria", partner: "Greoh Studios" },
  { location: [-30.5595, 22.9375], size: 0.07, country: "South Africa", partner: "Wallflower Productions" },
  { location: [26.8206, 30.8025], size: 0.07, country: "Egypt", partner: "Asap Films" },
  { location: [55.3781, -3.436], size: 0.07, country: "United Kingdom", partner: "Precession Productions" },
];

// Project lat/lng to 2D screen coordinates given current globe rotation
function projectMarker(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  width: number,
  height: number
): { x: number; y: number; visible: boolean } {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // Spherical to cartesian
  const x = Math.cos(latRad) * Math.sin(lngRad - phi);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(lngRad - phi);

  // Apply theta rotation (vertical tilt)
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const ry = y * cosT - z * sinT;
  const rz = y * sinT + z * cosT;

  // Only visible if facing camera
  const visible = rz > -0.1;

  // Simple orthographic projection
  const scale = 0.42;
  const screenX = width / 2 + x * width * scale;
  const screenY = height / 2 - ry * height * scale;

  return { x: screenX, y: screenY, visible };
}

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);
  const pointerDown = useRef<{ x: number; y: number; phi: number; theta: number } | null>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const frameRef = useRef<number>(0);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: string;
    partner: string;
  } | null>(null);

  const widthRef = useRef(0);

  const onResize = useCallback(() => {
    if (containerRef.current && globeRef.current) {
      const w = containerRef.current.offsetWidth;
      widthRef.current = w;
      globeRef.current.update({
        width: w * 2,
        height: w * 2,
      });
    }
  }, []);

  // Track mouse for marker hover
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (!e.touches[0]) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Handle drag rotation
    if (pointerDown.current) {
      const dx = clientX - pointerDown.current.x;
      const dy = clientY - pointerDown.current.y;
      phiRef.current = pointerDown.current.phi - dx / 150;
      thetaRef.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, pointerDown.current.theta + dy / 150)
      );
    }

    // Check marker proximity
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    let closestMarker: MarkerData | null = null;
    let closestDist = Infinity;
    const hitRadius = w * 0.06; // generous hit area

    for (const m of MARKERS) {
      const pos = projectMarker(
        m.location[0],
        m.location[1],
        phiRef.current,
        thetaRef.current,
        w,
        h
      );
      if (!pos.visible) continue;

      const dist = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
      if (dist < hitRadius && dist < closestDist) {
        closestDist = dist;
        closestMarker = m;
      }
    }

    if (closestMarker) {
      const pos = projectMarker(
        closestMarker.location[0],
        closestMarker.location[1],
        phiRef.current,
        thetaRef.current,
        w,
        h
      );
      setTooltip({
        x: pos.x,
        y: pos.y,
        country: closestMarker.country,
        partner: closestMarker.partner,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const w = containerRef.current.offsetWidth;
    widthRef.current = w;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: w * 2,
      height: w * 2,
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
      if (!pointerDown.current) {
        phiRef.current += 0.003;
      }
      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
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
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[600px] mx-auto"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseLeave={() => {
        setTooltip(null);
        pointerDown.current = null;
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      }}
    >
      {/* Gold glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-gold/5 blur-3xl scale-75 pointer-events-none" />

      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerDown.current = {
            x: e.clientX,
            y: e.clientY,
            phi: phiRef.current,
            theta: thetaRef.current,
          };
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerDown.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1s ease",
          touchAction: "none",
        }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 transition-all duration-150"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -120%)",
          }}
        >
          <div className="bg-[#0A0A0A]/95 border border-gold/50 rounded-lg px-4 py-3 backdrop-blur-md shadow-xl shadow-black/50 whitespace-nowrap">
            <div className="text-gold text-[10px] uppercase tracking-[2.5px] font-semibold mb-1">
              {tooltip.country}
            </div>
            <div className="text-white text-sm font-semibold">
              {tooltip.partner}
            </div>
            <div className="text-neutral-500 text-xs mt-1">
              Pre / Production / Post
            </div>
          </div>
          {/* Arrow */}
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gold/50 mx-auto" />
        </div>
      )}
    </div>
  );
}
