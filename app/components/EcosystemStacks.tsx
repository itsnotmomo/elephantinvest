// components/EcosystemStacks.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

type Step = "intro" | "tech" | "fintech" | "pharma" | "outro";
type ActiveKey = "tech" | "fintech" | "pharma";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function stepFromProgress(p: number): Step {
  if (p < 0.34) return "intro";
  if (p < 0.58) return "tech";
  if (p < 0.86) return "fintech";
  if (p < 0.96) return "pharma";
  return "outro";
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) => v.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(
    Math.round(lerp(A.r, B.r, t)),
    Math.round(lerp(A.g, B.g, t)),
    Math.round(lerp(A.b, B.b, t))
  );
}
function tint(hex: string, t: number) {
  if (t >= 0) return mix(hex, "#ffffff", clamp01(t));
  return mix(hex, "#000000", clamp01(-t));
}
function safeSvgId(v: string) {
  return v.replace(/[^a-zA-Z0-9_-]/g, "");
}

function IsoTileSVG({
  label,
  active,
  fill,
  patternText,
  centerText,
  logos,
  logoIndex,
}: {
  label: string;
  active: boolean;
  fill: string;
  patternText: string;
  centerText: string;
  logos: string[];
  logoIndex: number;
}) {
  const rid = useId();
  const uid = safeSvgId(`${rid}_${label}`);

  const gradTopId = `gradTop_${uid}`;
  const gradLeftId = `gradLeft_${uid}`;
  const gradRightId = `gradRight_${uid}`;
  const clipTopId = `clipTop_${uid}`;

  const baseTopA = "#ffffff";
  const baseTopB = "#fbfbfb";
  const baseLeftA = "#f3f3f3";
  const baseLeftB = "#e9e9e9";
  const baseRightA = "#efefef";
  const baseRightB = "#e3e3e3";

  const topA = tint(fill, 0.06);
  const topB = tint(fill, -0.03);
  const leftA = tint(fill, -0.08);
  const leftB = tint(fill, -0.2);
  const rightA = tint(fill, -0.12);
  const rightB = tint(fill, -0.26);

  const cx = 140;
  const cy = 72;
  const logoW = 62;
  const logoH = 62;
  const logoRotate = -28;

  const safeLogos = logos?.length ? logos : [];
  const activeIdx = safeLogos.length ? ((logoIndex % safeLogos.length) + safeLogos.length) % safeLogos.length : 0;

  return (
    <svg viewBox="0 0 280 170" className="w-full h-full" aria-label={label} role="img">
      <defs>
        <linearGradient id={gradTopId} x1="60" y1="30" x2="220" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={active ? topA : baseTopA} />
          <stop offset="1" stopColor={active ? topB : baseTopB} />
        </linearGradient>
        <linearGradient id={gradLeftId} x1="30" y1="70" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={active ? leftA : baseLeftA} />
          <stop offset="1" stopColor={active ? leftB : baseLeftB} />
        </linearGradient>
        <linearGradient id={gradRightId} x1="250" y1="70" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={active ? rightA : baseRightA} />
          <stop offset="1" stopColor={active ? rightB : baseRightB} />
        </linearGradient>
        <clipPath id={clipTopId}>
          <polygon points="140,18 260,72 140,126 20,72" />
        </clipPath>
      </defs>

      <g>
        <polygon
          points="140,18 260,72 140,126 20,72"
          fill={`url(#${gradTopId})`}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
        />
        <path d="M 140 18 L 260 72" stroke="rgba(255,255,255,0.55)" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M 140 18 L 20 72" stroke="rgba(255,255,255,0.38)" strokeWidth="1.1" strokeLinecap="round" />
        <polygon
          points="20,72 140,126 140,148 20,94"
          fill={`url(#${gradLeftId})`}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
        <polygon
          points="260,72 140,126 140,148 260,94"
          fill={`url(#${gradRightId})`}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
        />
        <g clipPath={`url(#${clipTopId})`}>
          <g transform={`translate(${cx} ${cy}) rotate(${logoRotate})`}>
            {safeLogos.map((href, i) => (
              <motion.image
                key={`${uid}_${i}_${href}`}
                href={href}
                x={-logoW / 2}
                y={-logoH / 2}
                width={logoW}
                height={logoH}
                preserveAspectRatio="xMidYMid meet"
                initial={false}
                animate={{ opacity: active && i === activeIdx ? 0.9 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}

function Tile({
  label,
  patternText,
  centerText,
  isActive,
  activeFill,
  baseY,
  movedX,
  movedY,
  z,
  tileRef,
  logos,
  logoIndex,
}: {
  label: string;
  patternText: string;
  centerText: string;
  isActive: boolean;
  activeFill: string;
  baseY: number;
  movedX: number;
  movedY: number;
  z: number;
  tileRef: React.RefObject<HTMLDivElement>;
  logos: string[];
  logoIndex: number;
}) {
  return (
    <motion.div
      ref={tileRef}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: 0, zIndex: z }}
      animate={{
        x: isActive ? movedX : 0,
        y: isActive ? movedY : baseY,
        scale: isActive ? 1.01 : 1,
      }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-[260px] sm:w-[300px] lg:w-[330px] aspect-[280/170]">
        <IsoTileSVG
          label={label}
          active={isActive}
          fill={activeFill}
          patternText={patternText}
          centerText={centerText}
          logos={logos}
          logoIndex={logoIndex}
        />
      </div>
    </motion.div>
  );
}

function activeKey(step: Step): ActiveKey | null {
  if (step === "tech") return "tech";
  if (step === "fintech") return "fintech";
  if (step === "pharma") return "pharma";
  return null;
}

function stepTitle(step: Step | ActiveKey) {
  if (step === "tech") return "Technology";
  if (step === "fintech") return "Fintech";
  if (step === "pharma") return "Pharmaceuticals";
  return "Supporting a full-stack ecosystem";
}
function stepBody(step: Step | ActiveKey) {
  if (step === "tech")
    return "We back intelligent systems and software platforms that compound decision-making and productivity across industries.";
  if (step === "fintech")
    return "We invest in infrastructure that moves money with less friction — payments, settlement, identity, and trust.";
  if (step === "pharma")
    return "We support companies reshaping health — enabling science and breakthroughs in prevention and treatment.";
  return "We invest in companies shaping the next decade — across technology, fintech infrastructure, and life sciences.";
}

const MOBILE_TABS: { key: ActiveKey; label: string }[] = [
  { key: "tech", label: "Technology" },
  { key: "fintech", label: "Fintech" },
  { key: "pharma", label: "Pharma" },
];

export default function EcosystemStacks() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const techTileRef = useRef<HTMLDivElement | null>(null);
  const fintechTileRef = useRef<HTMLDivElement | null>(null);
  const pharmaTileRef = useRef<HTMLDivElement | null>(null);

  const lineTargetRef = useRef<HTMLSpanElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted && isDesktop ? wrapRef : undefined,
    offset: ["start start", "end end"],
  });

  const [step, setStep] = useState<Step>("intro");

  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number; on: boolean }>({
    x1: 0, y1: 0, x2: 0, y2: 0, on: false,
  });

  const layout = useMemo(() => ({ gap: 86, slideX: 220, slideY: 10 }), []);
  // Mobile/tablet slide: active tile moves right by ~60px relative to center
  const mobileLayout = useMemo(() => ({ gap: 78, slideX: 56, slideY: 0 }), []);

  const fills: Record<ActiveKey, string> = { tech: "#6F7CF6", fintech: "#C8A46A", pharma: "#3FB58B" };

  const logos = useMemo(
    () => ({
      tech: ["/enphase1.png", "/ionq1.png", "/opendoor1.png"],
      fintech: ["/mara1.png", "/bitfarms1.png", "/cyphermining1.png"],
      pharma: ["/unh1.png", "/beyondmeat1.png"],
    }),
    []
  );

  const [techLogoIndex, setTechLogoIndex] = useState(0);
  const [fintechLogoIndex, setFintechLogoIndex] = useState(0);
  const [pharmaLogoIndex, setPharmaLogoIndex] = useState(0);

  // Mobile/tablet: manual tab selection (no auto-cycle)
  const [mobileActive, setMobileActive] = useState<ActiveKey>("tech");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isDesktop) return;
    setStep(stepFromProgress(v));
  });

  // Logo rotation timing
  useEffect(() => {
    let id: any = null;
    const intervalMs = 3600;
    const activeForLogos: ActiveKey | null = isDesktop ? activeKey(step) : mobileActive;
    if (activeForLogos === "tech") id = setInterval(() => setTechLogoIndex((i) => i + 1), intervalMs);
    if (activeForLogos === "fintech") id = setInterval(() => setFintechLogoIndex((i) => i + 1), intervalMs);
    if (activeForLogos === "pharma") id = setInterval(() => setPharmaLogoIndex((i) => i + 1), intervalMs);
    return () => { if (id) clearInterval(id); };
  }, [isDesktop, step, mobileActive]);

  // Desktop connector logic
  const measureLine = () => {
    const key = activeKey(step);
    const scene = sceneRef.current;
    const targetEl = lineTargetRef.current;
    if (!scene || !targetEl || !key) {
      setLine((prev) => (prev.on ? { ...prev, on: false } : prev));
      return;
    }
    const tileEl =
      key === "tech" ? techTileRef.current : key === "fintech" ? fintechTileRef.current : pharmaTileRef.current;
    if (!tileEl) {
      setLine((prev) => (prev.on ? { ...prev, on: false } : prev));
      return;
    }
    const s = scene.getBoundingClientRect();
    const t = tileEl.getBoundingClientRect();
    const a = targetEl.getBoundingClientRect();
    const x1 = t.right - s.left;
    const y1 = t.top - s.top + t.height * 0.52;
    const x2 = a.left - s.left;
    const y2 = a.top - s.top + a.height * 0.55;
    setLine({ x1, y1, x2, y2, on: true });
  };

  useEffect(() => {
    if (!isDesktop) return;
    let raf = 0;
    const tick = () => { measureLine(); raf = requestAnimationFrame(tick); };
    if (activeKey(step)) raf = requestAnimationFrame(tick);
    else measureLine();
    const onResize = () => measureLine();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, step]);

  const dx = line.x2 - line.x1;
  const c1x = line.x1 + dx * 0.38;
  const c1y = line.y1;
  const c2x = line.x2 - dx * 0.28;
  const c2y = line.y2;
  const pathD = `M ${line.x1} ${line.y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${line.x2} ${line.y2}`;

  const activeStroke = (() => {
    if (step === "tech") return fills.tech;
    if (step === "fintech") return fills.fintech;
    if (step === "pharma") return fills.pharma;
    return "rgba(17,17,17,0.35)";
  })();

  const y0 = 0;
  const y1 = y0 + layout.gap;
  const y2 = y1 + layout.gap;

  const my0 = 0;
  const my1 = my0 + mobileLayout.gap;
  const my2 = my1 + mobileLayout.gap;

  const desktopIsTech = step === "tech";
  const desktopIsFintech = step === "fintech";
  const desktopIsPharma = step === "pharma";

  const mobileIsTech = mobileActive === "tech";
  const mobileIsFintech = mobileActive === "fintech";
  const mobileIsPharma = mobileActive === "pharma";

  const activeColor = fills[mobileActive];

  // ===== MOBILE + TABLET RENDER =====
  // Both mobile and tablet use the same stacked layout (no sm:flex-row)
  const MobileView = (
    <section className="relative bg-[#fbfaf7]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-16">

        {/* Tab navigation buttons (VisionFund-style) */}
        <div className="mb-8 flex items-center gap-0 relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
          {MOBILE_TABS.map(({ key, label }) => {
            const isActive = mobileActive === key;
            return (
              <button
                key={key}
                onClick={() => setMobileActive(key)}
                className="relative pb-3 pr-6 text-[13px] font-medium tracking-wide transition-colors duration-200 focus:outline-none"
                style={{ color: isActive ? "#111111" : "#9ca3af" }}
              >
                {label}
                {/* Active underline */}
                <motion.div
                  className="absolute bottom-0 left-0 right-6 h-[2px]"
                  style={{ backgroundColor: fills[key] }}
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </button>
            );
          })}
        </div>

        {/* Main content area: stacks on top, text below — always stacked (mobile + tablet) */}
        <div className="flex flex-col gap-8 items-start">

          {/* Stacks column */}
          <div className="relative flex-shrink-0 w-full">
            <div className="relative h-[260px] w-[220px] mx-auto">
              <Tile
                tileRef={techTileRef as any}
                label="Technology"
                patternText="Technology"
                centerText="TECH"
                isActive={mobileIsTech}
                activeFill={fills.tech}
                baseY={my0}
                movedX={mobileLayout.slideX}
                movedY={my0 + mobileLayout.slideY}
                z={mobileIsTech ? 40 : 10}
                logos={logos.tech}
                logoIndex={techLogoIndex}
              />
              <Tile
                tileRef={fintechTileRef as any}
                label="Fintech"
                patternText="Fintech"
                centerText="FIN"
                isActive={mobileIsFintech}
                activeFill={fills.fintech}
                baseY={my1}
                movedX={mobileLayout.slideX}
                movedY={my1 + mobileLayout.slideY}
                z={mobileIsFintech ? 40 : 9}
                logos={logos.fintech}
                logoIndex={fintechLogoIndex}
              />
              <Tile
                tileRef={pharmaTileRef as any}
                label="Pharmaceuticals"
                patternText="Pharmaceuticals"
                centerText="LIFE"
                isActive={mobileIsPharma}
                activeFill={fills.pharma}
                baseY={my2}
                movedX={mobileLayout.slideX}
                movedY={my2 + mobileLayout.slideY}
                z={mobileIsPharma ? 40 : 8}
                logos={logos.pharma}
                logoIndex={pharmaLogoIndex}
              />
            </div>
          </div>

          {/* Text column — animates in on tab change */}
          <div className="flex-1 pt-2">
            <div className="mb-2 flex items-center gap-3 text-[11px] tracking-[0.28em] text-neutral-400">
              <span className="h-px w-8" style={{ backgroundColor: activeColor }} />
              ECOSYSTEM
            </div>

            <motion.div
              key={mobileActive}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2
                className="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900"
                style={{ color: "#111111" }}
              >
                {stepTitle(mobileActive)}
              </h2>
              <p className="mt-4 max-w-xs text-[14px] leading-6 text-neutral-500">
                {stepBody(mobileActive)}
              </p>
            </motion.div>

            {/* Color accent dot */}
            <div className="mt-6 flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activeColor }}
              />
              <span className="text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
                {mobileActive === "tech" ? "Technology" : mobileActive === "fintech" ? "Fintech" : "Pharmaceuticals"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ===== DESKTOP RENDER (unchanged) =====
  const DesktopView = (
    <section ref={wrapRef} className="relative bg-[#fbfaf7]">
      <div className="h-[320vh]">
        <div className="sticky top-0 h-screen">
          <div ref={sceneRef} className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-14 h-full">
            {/* CONNECTOR */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <svg className="w-full h-full" aria-hidden="true">
                <motion.path
                  d={pathD}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.25"
                  initial={false}
                  animate={{ opacity: line.on ? 1 : 0, stroke: activeStroke }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center h-full gap-10">
              {/* LEFT: stacks */}
              <div className="relative h-[360px] sm:h-[400px] lg:h-[440px] lg:-ml-56 xl:-ml-72 lg:mt-10">
                <Tile
                  tileRef={techTileRef as any}
                  label="Technology"
                  patternText="Technology"
                  centerText="TECH"
                  isActive={desktopIsTech}
                  activeFill={fills.tech}
                  baseY={y0}
                  movedX={layout.slideX}
                  movedY={y0 + layout.slideY}
                  z={desktopIsTech ? 40 : 10}
                  logos={logos.tech}
                  logoIndex={techLogoIndex}
                />
                <Tile
                  tileRef={fintechTileRef as any}
                  label="Fintech"
                  patternText="Fintech"
                  centerText="FIN"
                  isActive={desktopIsFintech}
                  activeFill={fills.fintech}
                  baseY={y1}
                  movedX={layout.slideX}
                  movedY={y1 + layout.slideY}
                  z={desktopIsFintech ? 40 : 9}
                  logos={logos.fintech}
                  logoIndex={fintechLogoIndex}
                />
                <Tile
                  tileRef={pharmaTileRef as any}
                  label="Pharmaceuticals"
                  patternText="Pharmaceuticals"
                  centerText="LIFE"
                  isActive={desktopIsPharma}
                  activeFill={fills.pharma}
                  baseY={y2}
                  movedX={layout.slideX}
                  movedY={y2 + layout.slideY}
                  z={desktopIsPharma ? 40 : 8}
                  logos={logos.pharma}
                  logoIndex={pharmaLogoIndex}
                />
              </div>

              {/* RIGHT: text */}
              <div className="relative">
                <div className="mb-3 flex items-center gap-3 text-[11px] tracking-[0.28em] text-neutral-500">
                  <span className="h-px w-10 bg-neutral-300" />
                  ECOSYSTEM
                </div>

                <span ref={lineTargetRef} className="hidden lg:block absolute -left-2 top-[92px] h-10 w-2" aria-hidden="true" />

                {(step === "intro" || step === "outro") && (
                  <>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">
                      Supporting a full-stack ecosystem
                    </h2>
                    <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">
                      We invest in companies shaping the next decade — across technology, fintech infrastructure, and life sciences.
                    </p>
                  </>
                )}

                {step === "tech" && (
                  <>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">
                      Technology
                    </h2>
                    <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">
                      We back intelligent systems and software platforms that compound decision-making and productivity across industries.
                    </p>
                  </>
                )}

                {step === "fintech" && (
                  <>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">
                      Fintech
                    </h2>
                    <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">
                      We invest in infrastructure that moves money with less friction — payments, settlement, identity, and trust.
                    </p>
                  </>
                )}

                {step === "pharma" && (
                  <>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">
                      Pharmaceuticals
                    </h2>
                    <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">
                      We support companies reshaping health — enabling science and breakthroughs in prevention and treatment.
                    </p>
                  </>
                )}

                <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2">
                  <div className="writing-mode-vertical text-[11px] tracking-[0.25em] text-neutral-400">ECOSYSTEM</div>
                </div>

                <style jsx>{`
                  .writing-mode-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return isDesktop ? DesktopView : MobileView;
}