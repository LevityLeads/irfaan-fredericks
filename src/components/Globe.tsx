"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface PartnerMarker {
  lng: number;
  lat: number;
  country: string;
  partner: string;
}

const PARTNERS: PartnerMarker[] = [
  { lat: 20.5937, lng: 78.9629, country: "India", partner: "India Take One" },
  { lat: 23.8859, lng: 45.0792, country: "Saudi Arabia", partner: "Ideation Studios" },
  { lat: 9.082, lng: 8.6753, country: "Nigeria", partner: "Greoh Studios" },
  { lat: -30.5595, lng: 22.9375, country: "South Africa", partner: "Wallflower Productions" },
  { lat: 26.8206, lng: 30.8025, country: "Egypt", partner: "Asap Films" },
  { lat: 55.3781, lng: -3.436, country: "United Kingdom", partner: "Precession Productions" },
];

// Point-in-polygon test
function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pointInFeature(point: [number, number], feature: any): boolean {
  const geometry = feature.geometry;
  if (geometry.type === "Polygon") {
    const coords = geometry.coordinates;
    if (!pointInPolygon(point, coords[0])) return false;
    for (let i = 1; i < coords.length; i++) {
      if (pointInPolygon(point, coords[i])) return false;
    }
    return true;
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      if (pointInPolygon(point, polygon[0])) {
        let inHole = false;
        for (let i = 1; i < polygon.length; i++) {
          if (pointInPolygon(point, polygon[i])) { inHole = true; break; }
        }
        if (!inHole) return true;
      }
    }
  }
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateDots(feature: any, spacing = 14): [number, number][] {
  const dots: [number, number][] = [];
  const bounds = d3.geoBounds(feature);
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const step = spacing * 0.08;
  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      const pt: [number, number] = [lng, lat];
      if (pointInFeature(pt, feature)) dots.push(pt);
    }
  }
  return dots;
}

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: string;
    partner: string;
  } | null>(null);
  const [ready, setReady] = useState(false);

  // Store refs for cleanup
  const timerRef = useRef<d3.Timer | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const initGlobe = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Responsive sizing
    const containerWidth = container.offsetWidth;
    if (containerWidth < 50) return;
    const containerHeight = containerWidth; // square
    const radius = containerWidth / 2.3;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    // Projection
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    // State
    const allDots: { lng: number; lat: number }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any = null;
    const rotation: [number, number] = [0, -10];
    let autoRotate = true;
    let pulsePhase = 0;

    // Gold colors
    const GOLD = "#C9A84C";
    const GOLD_DIM = "rgba(201, 168, 76, 0.4)";
    const GOLD_GLOW = "rgba(201, 168, 76, 0.15)";
    const DOT_COLOR = "rgba(201, 168, 76, 0.5)";
    const GRID_COLOR = "rgba(201, 168, 76, 0.08)";

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;
      const cx = containerWidth / 2;
      const cy = containerHeight / 2;

      // Outer glow
      const glowGrad = context.createRadialGradient(cx, cy, currentScale * 0.95, cx, cy, currentScale * 1.3);
      glowGrad.addColorStop(0, GOLD_GLOW);
      glowGrad.addColorStop(1, "rgba(201, 168, 76, 0)");
      context.beginPath();
      context.arc(cx, cy, currentScale * 1.3, 0, 2 * Math.PI);
      context.fillStyle = glowGrad;
      context.fill();

      // Globe background (dark sphere)
      context.beginPath();
      context.arc(cx, cy, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#0D0D0D";
      context.fill();

      // Subtle globe border
      context.beginPath();
      context.arc(cx, cy, currentScale, 0, 2 * Math.PI);
      context.strokeStyle = GOLD_DIM;
      context.lineWidth = 1 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = GRID_COLOR;
        context.lineWidth = 0.5 * scaleFactor;
        context.stroke();

        // Land outlines
        context.beginPath();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => path(feature));
        context.strokeStyle = "rgba(201, 168, 76, 0.15)";
        context.lineWidth = 0.8 * scaleFactor;
        context.stroke();

        // Halftone dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0] >= 0 && projected[0] <= containerWidth &&
            projected[1] >= 0 && projected[1] <= containerHeight
          ) {
            context.beginPath();
            context.arc(projected[0], projected[1], 1.0 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = DOT_COLOR;
            context.fill();
          }
        });

        // Partner markers
        pulsePhase += 0.03;
        const pulse = Math.sin(pulsePhase) * 0.3 + 0.7;

        PARTNERS.forEach((marker) => {
          const projected = projection([marker.lng, marker.lat]);
          if (
            projected &&
            projected[0] >= 0 && projected[0] <= containerWidth &&
            projected[1] >= 0 && projected[1] <= containerHeight
          ) {
            // Check if on visible side
            const dist = d3.geoDistance(
              [marker.lng, marker.lat],
              [-rotation[0], -rotation[1]]
            );
            if (dist > Math.PI / 2) return;

            const mx = projected[0];
            const my = projected[1];

            // Glow ring
            context.beginPath();
            context.arc(mx, my, 8 * scaleFactor * pulse, 0, 2 * Math.PI);
            context.fillStyle = `rgba(201, 168, 76, ${0.1 * pulse})`;
            context.fill();

            // Outer ring
            context.beginPath();
            context.arc(mx, my, 5 * scaleFactor, 0, 2 * Math.PI);
            context.strokeStyle = GOLD;
            context.lineWidth = 1.5 * scaleFactor;
            context.stroke();

            // Inner dot
            context.beginPath();
            context.arc(mx, my, 2.5 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = GOLD;
            context.fill();
          }
        });
      }
    };

    // Load world data
    const loadData = async () => {
      try {
        const resp = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!resp.ok) throw new Error("Failed to load land data");
        landFeatures = await resp.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDots(feature, 14);
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
        });

        render();
        setReady(true);
      } catch {
        // Silently fail - globe just won't show land
        setReady(true);
      }
    };

    // Rotation animation
    const animate = () => {
      if (autoRotate) {
        rotation[0] += 0.15;
        projection.rotate(rotation);
      }
      pulsePhase += 0; // pulse already incremented in render
      render();
    };

    const timer = d3.timer(animate);
    timerRef.current = timer;

    // Mouse/touch drag
    const handlePointerDown = (e: PointerEvent) => {
      autoRotate = false;
      canvas.setPointerCapture(e.pointerId);
      const startX = e.clientX;
      const startY = e.clientY;
      const startRotation: [number, number] = [...rotation];

      const handlePointerMove = (me: PointerEvent) => {
        const sensitivity = 0.3;
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;
        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = Math.max(-60, Math.min(60, startRotation[1] - dy * sensitivity));
        projection.rotate(rotation);
        render();
      };

      const handlePointerUp = () => {
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUp);
        setTimeout(() => { autoRotate = true; }, 1500);
      };

      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
    };

    // Hover detection for markers
    const handleHover = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hitRadius = 20;

      let found: PartnerMarker | null = null;
      let foundPos: [number, number] | null = null;

      for (const marker of PARTNERS) {
        const projected = projection([marker.lng, marker.lat]);
        if (!projected) continue;

        // Check visibility
        const dist = d3.geoDistance(
          [marker.lng, marker.lat],
          [-rotation[0], -rotation[1]]
        );
        if (dist > Math.PI / 2) continue;

        const dx = mx - projected[0];
        const dy = my - projected[1];
        if (Math.sqrt(dx * dx + dy * dy) < hitRadius) {
          found = marker;
          foundPos = projected;
          break;
        }
      }

      if (found && foundPos) {
        const containerRect = container.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        setTooltip({
          x: canvasRect.left - containerRect.left + foundPos[0],
          y: canvasRect.top - containerRect.top + foundPos[1],
          country: found.country,
          partner: found.partner,
        });
        canvas.style.cursor = "pointer";
      } else {
        setTooltip(null);
        canvas.style.cursor = "grab";
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("mousemove", handleHover);
    canvas.style.touchAction = "none";

    cleanupRef.current = () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("mousemove", handleHover);
    };

    loadData();

    return () => {
      timer.stop();
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  useEffect(() => {
    const cleanup = initGlobe();

    const handleResize = () => {
      // Re-init on resize
      if (timerRef.current) timerRef.current.stop();
      if (cleanupRef.current) cleanupRef.current();
      initGlobe();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener("resize", handleResize);
    };
  }, [initGlobe]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[600px] mx-auto">
      <canvas
        ref={canvasRef}
        className={`w-full h-auto transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{ maxWidth: "100%", height: "auto" }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -130%)",
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
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gold/50 mx-auto" />
        </div>
      )}
    </div>
  );
}
