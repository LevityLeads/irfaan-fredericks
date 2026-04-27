"use client";

import { useEffect, useRef, useState } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  country: string;
  partner: string;
  services: string[];
}

const MARKERS: MarkerData[] = [
  {
    lat: 20.5937,
    lng: 78.9629,
    country: "India",
    partner: "India Take One",
    services: ["Pre-Production", "Production", "Post-Production"],
  },
  {
    lat: 23.8859,
    lng: 45.0792,
    country: "Saudi Arabia",
    partner: "Ideation Studios",
    services: ["Pre-Production", "Production", "Post-Production"],
  },
  {
    lat: 9.082,
    lng: 8.6753,
    country: "Nigeria",
    partner: "Greoh Studios",
    services: ["Pre-Production", "Production", "Post-Production"],
  },
  {
    lat: -30.5595,
    lng: 22.9375,
    country: "South Africa",
    partner: "Wallflower Productions",
    services: ["Pre-Production", "Production", "Post-Production"],
  },
  {
    lat: 26.8206,
    lng: 30.8025,
    country: "Egypt",
    partner: "Asap Films",
    services: ["Pre-Production", "Production", "Post-Production"],
  },
  {
    lat: 55.3781,
    lng: -3.436,
    country: "United Kingdom",
    partner: "Precession Productions",
    services: ["Pre-Production", "Production", "Post-Production"],
  },
];

function generateArcs() {
  const hub = MARKERS[3];
  return MARKERS.filter((_, i) => i !== 3).map((m) => ({
    startLat: hub.lat,
    startLng: hub.lng,
    endLat: m.lat,
    endLng: m.lng,
  }));
}

function makeLabel(d: MarkerData) {
  return `
    <div style="
      background: rgba(10,10,10,0.95);
      border: 1px solid rgba(201,168,76,0.5);
      border-radius: 10px;
      padding: 14px 18px;
      font-family: Inter, system-ui, sans-serif;
      min-width: 200px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.1);
    ">
      <div style="color: #C9A84C; font-size: 10px; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 6px; font-weight: 600;">${d.country}</div>
      <div style="color: #FAFAFA; font-size: 15px; font-weight: 600; margin-bottom: 10px; line-height: 1.3;">${d.partner}</div>
      <div style="display: flex; flex-direction: column; gap: 5px;">
        ${d.services
          .map(
            (s) =>
              `<div style="color: #999; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                <span style="color: #C9A84C; font-size: 10px;">&#10003;</span> ${s}
              </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

export default function Globe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState(0);

  // Track wrapper size with ResizeObserver
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        if (w > 0) setSize(w);
      }
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  // Initialize globe once we have a real size
  useEffect(() => {
    if (size < 100 || !containerRef.current) return;
    if (globeRef.current) {
      // Just resize existing globe
      globeRef.current.width(size).height(size);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let globe: any = null;

    import("globe.gl").then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const GlobeGL = mod.default as any;
      const container = containerRef.current;
      if (!container) return;

      const arcs = generateArcs();

      globe = GlobeGL({ animateIn: true })
        .width(size)
        .height(size)
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("#C9A84C")
        .atmosphereAltitude(0.12)
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-night.jpg"
        )
        // Points
        .pointsData(MARKERS)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor(() => "#C9A84C")
        .pointAltitude(0.015)
        .pointRadius(0.45)
        .pointsMerge(false)
        .pointLabel((d: object) => makeLabel(d as MarkerData))
        // Arcs
        .arcsData(arcs)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => ["rgba(201,168,76,0.25)", "rgba(201,168,76,0.25)"])
        .arcDashLength(0.5)
        .arcDashGap(0.3)
        .arcDashAnimateTime(3000)
        .arcStroke(0.3)(container);

      // Orbit controls
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = 0.6;
      controls.minPolarAngle = Math.PI * 0.2;
      controls.maxPolarAngle = Math.PI * 0.8;

      // Initial view - zoom out a bit more on small screens
      const altitude = size < 400 ? 2.8 : 2.2;
      globe.pointOfView({ lat: 15, lng: 25, altitude });

      globeRef.current = globe;
      setTimeout(() => setLoaded(true), 300);
    });

    return () => {
      if (globe && typeof globe._destructor === "function") {
        globe._destructor();
        globeRef.current = null;
      }
    };
    // Only run on first valid size
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size > 0 ? 1 : 0]);

  // Handle resize after init
  useEffect(() => {
    if (globeRef.current && size > 100) {
      globeRef.current.width(size).height(size);
    }
  }, [size]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[600px] mx-auto"
    >
      {/* Gold glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-gold/5 blur-3xl scale-75" />
      <div
        ref={containerRef}
        style={{ width: size || "100%", height: size || 300 }}
        className={`transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
