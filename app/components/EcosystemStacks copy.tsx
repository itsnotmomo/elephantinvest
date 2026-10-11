// components/EcosystemStacks.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

type Step = "intro" | "tech" | "fintech" | "pharma" | "outro";
type ActiveKey = "tech" | "fintech" | "pharma";

function clamp01(v: number) { return Math.min(1, Math.max(0, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

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
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(Math.round(lerp(A.r,B.r,t)), Math.round(lerp(A.g,B.g,t)), Math.round(lerp(A.b,B.b,t)));
}
function tint(hex: string, t: number) {
  return t >= 0 ? mix(hex, "#ffffff", clamp01(t)) : mix(hex, "#000000", clamp01(-t));
}
function safeSvgId(v: string) { return v.replace(/[^a-zA-Z0-9_-]/g, ""); }

function IsoTileSVG({ label, active, fill, logos, logoIndex }: {
  label: string; active: boolean; fill: string; logos: string[]; logoIndex: number;
}) {
  const rid = useId();
  const uid = safeSvgId(`${rid}_${label}`);
  const gT = `gT_${uid}`, gL = `gL_${uid}`, gR = `gR_${uid}`, cT = `cT_${uid}`;
  const topA = tint(fill, 0.06), topB = tint(fill, -0.03);
  const leftA = tint(fill, -0.08), leftB = tint(fill, -0.2);
  const rightA = tint(fill, -0.12), rightB = tint(fill, -0.26);
  const safeLogos = logos?.length ? logos : [];
  const activeIdx = safeLogos.length ? ((logoIndex % safeLogos.length) + safeLogos.length) % safeLogos.length : 0;

  return (
    <svg viewBox="0 0 280 170" width="100%" height="100%" aria-label={label} role="img">
      <defs>
        <linearGradient id={gT} x1="60" y1="30" x2="220" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={active ? topA : "#ffffff"} />
          <stop offset="1" stopColor={active ? topB : "#fbfbfb"} />
        </linearGradient>
        <linearGradient id={gL} x1="30" y1="70" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={active ? leftA : "#f3f3f3"} />
          <stop offset="1" stopColor={active ? leftB : "#e9e9e9"} />
        </linearGradient>
        <linearGradient id={gR} x1="250" y1="70" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={active ? rightA : "#efefef"} />
          <stop offset="1" stopColor={active ? rightB : "#e3e3e3"} />
        </linearGradient>
        <clipPath id={cT}><polygon points="140,18 260,72 140,126 20,72" /></clipPath>
      </defs>
      <polygon points="140,18 260,72 140,126 20,72" fill={`url(#${gT})`} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      <path d="M 140 18 L 260 72" stroke="rgba(255,255,255,0.55)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M 140 18 L 20 72" stroke="rgba(255,255,255,0.38)" strokeWidth="1.1" strokeLinecap="round" />
      <polygon points="20,72 140,126 140,148 20,94" fill={`url(#${gL})`} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
      <polygon points="260,72 140,126 140,148 260,94" fill={`url(#${gR})`} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
      <g clipPath={`url(#${cT})`}>
        <g transform="translate(140 72) rotate(-28)">
          {safeLogos.map((href, i) => (
            <motion.image key={`${uid}_${i}`} href={href} x={-31} y={-31} width={62} height={62}
              preserveAspectRatio="xMidYMid meet" initial={false}
              animate={{ opacity: active && i === activeIdx ? 0.9 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

function DesktopTile({ label, isActive, activeFill, baseY, movedX, movedY, z, tileRef, logos, logoIndex }: {
  label: string; isActive: boolean; activeFill: string;
  baseY: number; movedX: number; movedY: number; z: number;
  tileRef: React.RefObject<HTMLDivElement>; logos: string[]; logoIndex: number;
}) {
  return (
    <motion.div ref={tileRef} className="absolute left-1/2 -translate-x-1/2" style={{ top: 0, zIndex: z }}
      animate={{ x: isActive ? movedX : 0, y: isActive ? movedY : baseY, scale: isActive ? 1.01 : 1 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-[260px] sm:w-[300px] lg:w-[330px]" style={{ aspectRatio: "280/170" }}>
        <IsoTileSVG label={label} active={isActive} fill={activeFill} logos={logos} logoIndex={logoIndex} />
      </div>
    </motion.div>
  );
}

// Non-desktop tile: fixed pixel width, absolutely stacked, only moves vertically
// TILE_W must match the column width in the grid below
const TILE_W = 280;
const TILE_H = Math.round(TILE_W * 170 / 280);

function SmallTile({ label, isActive, activeFill, baseY, z, tileRef, logos, logoIndex }: {
  label: string; isActive: boolean; activeFill: string;
  baseY: number; z: number;
  tileRef: React.RefObject<HTMLDivElement>; logos: string[]; logoIndex: number;
}) {
  return (
    <motion.div
      ref={tileRef}
      style={{ position: "absolute", top: 0, left: 0, width: TILE_W, height: TILE_H, zIndex: z }}
      animate={{ y: isActive ? baseY - 8 : baseY, scale: isActive ? 1.02 : 1 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <IsoTileSVG label={label} active={isActive} fill={activeFill} logos={logos} logoIndex={logoIndex} />
    </motion.div>
  );
}

function activeKey(step: Step): ActiveKey | null {
  if (step === "tech") return "tech";
  if (step === "fintech") return "fintech";
  if (step === "pharma") return "pharma";
  return null;
}

const TABS: { key: ActiveKey; label: string }[] = [
  { key: "tech", label: "Technology" },
  { key: "fintech", label: "Fintech" },
  { key: "pharma", label: "Pharma" },
];

const CONTENT: Record<ActiveKey, { title: string; body: string }> = {
  tech: { title: "Technology", body: "We back intelligent systems and software platforms that compound decision-making and productivity across industries." },
  fintech: { title: "Fintech", body: "We invest in infrastructure that moves money with less friction — payments, settlement, identity, and trust." },
  pharma: { title: "Pharmaceuticals", body: "We support companies reshaping health — enabling science and breakthroughs in prevention and treatment." },
};

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
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number; on: boolean }>({ x1:0,y1:0,x2:0,y2:0,on:false });

  const layout = useMemo(() => ({ gap: 86, slideX: 220, slideY: 10 }), []);
  const mGap = 80;

  const fills: Record<ActiveKey, string> = { tech: "#6F7CF6", fintech: "#C8A46A", pharma: "#3FB58B" };
  const logos = useMemo(() => ({
    tech: ["/enphase1.png", "/ionq1.png", "/opendoor1.png"],
    fintech: ["/mara1.png", "/bitfarms1.png", "/cyphermining1.png"],
    pharma: ["/unh1.png", "/beyondmeat1.png"],
  }), []);

  const [techLogoIdx, setTechLogoIdx] = useState(0);
  const [fintechLogoIdx, setFintechLogoIdx] = useState(0);
  const [pharmaLogoIdx, setPharmaLogoIdx] = useState(0);
  const [mobileActive, setMobileActive] = useState<ActiveKey>("tech");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isDesktop) return;
    setStep(stepFromProgress(v));
  });

  useEffect(() => {
    let id: any = null;
    const ms = 3600;
    const ak: ActiveKey | null = isDesktop ? activeKey(step) : mobileActive;
    if (ak === "tech") id = setInterval(() => setTechLogoIdx(i => i + 1), ms);
    if (ak === "fintech") id = setInterval(() => setFintechLogoIdx(i => i + 1), ms);
    if (ak === "pharma") id = setInterval(() => setPharmaLogoIdx(i => i + 1), ms);
    return () => { if (id) clearInterval(id); };
  }, [isDesktop, step, mobileActive]);

  const measureLine = () => {
    const key = activeKey(step);
    const scene = sceneRef.current, targetEl = lineTargetRef.current;
    if (!scene || !targetEl || !key) { setLine(p => p.on ? {...p, on:false} : p); return; }
    const tileEl = key === "tech" ? techTileRef.current : key === "fintech" ? fintechTileRef.current : pharmaTileRef.current;
    if (!tileEl) { setLine(p => p.on ? {...p, on:false} : p); return; }
    const s = scene.getBoundingClientRect(), t = tileEl.getBoundingClientRect(), a = targetEl.getBoundingClientRect();
    setLine({ x1: t.right-s.left, y1: t.top-s.top+t.height*0.52, x2: a.left-s.left, y2: a.top-s.top+a.height*0.55, on: true });
  };

  useEffect(() => {
    if (!isDesktop) return;
    let raf = 0;
    const tick = () => { measureLine(); raf = requestAnimationFrame(tick); };
    if (activeKey(step)) raf = requestAnimationFrame(tick); else measureLine();
    window.addEventListener("resize", measureLine);
    return () => { window.removeEventListener("resize", measureLine); if (raf) cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, step]);

  const dx = line.x2-line.x1, c1x = line.x1+dx*0.38, c2x = line.x2-dx*0.28;
  const pathD = `M ${line.x1} ${line.y1} C ${c1x} ${line.y1}, ${c2x} ${line.y2}, ${line.x2} ${line.y2}`;
  const activeStroke = step==="tech" ? fills.tech : step==="fintech" ? fills.fintech : step==="pharma" ? fills.pharma : "rgba(17,17,17,0.35)";

  const y0=0, y1=y0+layout.gap, y2=y1+layout.gap;
  const my0=0, my1=my0+mGap, my2=my1+mGap;
  // Total height needed: last tile baseY + tile height + some buffer
  const stacksH = my2 + TILE_H + 20;
  const activeColor = fills[mobileActive];

  // ─── MOBILE + TABLET ──────────────────────────────────────────────────────
  // TILE_W = 280px. Grid column for stacks = exactly 280px.
  // Tiles are positioned left:0, width:280px — they fit exactly in their column.
  // Text column gets 1fr of remaining space. Zero bleed possible.
  const MobileView = (
    <section className="relative bg-[#fbfaf7] pb-28 md:pb-40">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 md:px-14 pt-14 md:pt-20">

        {/* Tabs */}
        <div className="mb-10 flex items-center gap-0 relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
          {TABS.map(({ key, label }) => {
            const isActive = mobileActive === key;
            return (
              <button key={key} onClick={() => setMobileActive(key)}
                className="relative pb-3 pr-8 text-[13px] font-medium tracking-wide transition-colors duration-200 focus:outline-none"
                style={{ color: isActive ? "#111111" : "#9ca3af" }}
              >
                {label}
                <motion.div className="absolute bottom-0 left-0 right-8 h-[2px]"
                  style={{ backgroundColor: fills[key] }}
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </button>
            );
          })}
        </div>

        {/* 
          Grid: stacks column is EXACTLY TILE_W px wide.
          Tiles are absolutely positioned at left:0, width:TILE_W — they match 1:1.
          Text column gets the rest. Structurally impossible to overlap.
        */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `${TILE_W}px 1fr`,
          gap: "32px",
          alignItems: "center",
        }}>

          {/* Stacks column — exactly TILE_W wide, clipped */}
          <div style={{ position: "relative", height: stacksH, overflow: "hidden", flexShrink: 0 }}>
            <SmallTile tileRef={techTileRef as any} label="Technology"
              isActive={mobileActive==="tech"} activeFill={fills.tech}
              baseY={my0} z={mobileActive==="tech"?40:10}
              logos={logos.tech} logoIndex={techLogoIdx}
            />
            <SmallTile tileRef={fintechTileRef as any} label="Fintech"
              isActive={mobileActive==="fintech"} activeFill={fills.fintech}
              baseY={my1} z={mobileActive==="fintech"?40:9}
              logos={logos.fintech} logoIndex={fintechLogoIdx}
            />
            <SmallTile tileRef={pharmaTileRef as any} label="Pharmaceuticals"
              isActive={mobileActive==="pharma"} activeFill={fills.pharma}
              baseY={my2} z={mobileActive==="pharma"?40:8}
              logos={logos.pharma} logoIndex={pharmaLogoIdx}
            />
          </div>

          {/* Text column */}
          <div>
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}
              className="text-[11px] tracking-[0.28em] text-neutral-400">
              <span style={{ height: 1, width: 32, flexShrink: 0, backgroundColor: activeColor }} />
              ECOSYSTEM
            </div>
            <motion.div key={mobileActive}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight" style={{ color: "#111111" }}>
                {CONTENT[mobileActive].title}
              </h2>
              <p className="mt-3 text-[13px] sm:text-[14px] leading-6 text-neutral-500">
                {CONTENT[mobileActive].body}
              </p>
            </motion.div>
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ height: 8, width: 8, borderRadius: "50%", flexShrink: 0, backgroundColor: activeColor }} />
              <span className="text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
                {CONTENT[mobileActive].title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ─── DESKTOP ──────────────────────────────────────────────────────────────
  const DesktopView = (
    <section ref={wrapRef} className="relative bg-[#fbfaf7]">
      <div className="h-[320vh]">
        <div className="sticky top-0 h-screen">
          <div ref={sceneRef} className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-14 h-full">
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <svg className="w-full h-full" aria-hidden="true">
                <motion.path d={pathD} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25"
                  initial={false}
                  animate={{ opacity: line.on ? 1 : 0, stroke: activeStroke }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center h-full gap-10">
              <div className="relative h-[360px] sm:h-[400px] lg:h-[440px] lg:-ml-56 xl:-ml-72 lg:mt-10">
                <DesktopTile tileRef={techTileRef as any} label="Technology" isActive={step==="tech"} activeFill={fills.tech} baseY={y0} movedX={layout.slideX} movedY={y0+layout.slideY} z={step==="tech"?40:10} logos={logos.tech} logoIndex={techLogoIdx} />
                <DesktopTile tileRef={fintechTileRef as any} label="Fintech" isActive={step==="fintech"} activeFill={fills.fintech} baseY={y1} movedX={layout.slideX} movedY={y1+layout.slideY} z={step==="fintech"?40:9} logos={logos.fintech} logoIndex={fintechLogoIdx} />
                <DesktopTile tileRef={pharmaTileRef as any} label="Pharmaceuticals" isActive={step==="pharma"} activeFill={fills.pharma} baseY={y2} movedX={layout.slideX} movedY={y2+layout.slideY} z={step==="pharma"?40:8} logos={logos.pharma} logoIndex={pharmaLogoIdx} />
              </div>
              <div className="relative">
                <div className="mb-3 flex items-center gap-3 text-[11px] tracking-[0.28em] text-neutral-500">
                  <span className="h-px w-10 bg-neutral-300" />ECOSYSTEM
                </div>
                <span ref={lineTargetRef} className="hidden lg:block absolute -left-2 top-[92px] h-10 w-2" aria-hidden="true" />
                {(step==="intro"||step==="outro") && (<>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">Supporting a full-stack ecosystem</h2>
                  <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">We invest in companies shaping the next decade — across technology, fintech infrastructure, and life sciences.</p>
                </>)}
                {step==="tech" && (<>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">Technology</h2>
                  <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">We back intelligent systems and software platforms that compound decision-making and productivity across industries.</p>
                </>)}
                {step==="fintech" && (<>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">Fintech</h2>
                  <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">We invest in infrastructure that moves money with less friction — payments, settlement, identity, and trust.</p>
                </>)}
                {step==="pharma" && (<>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900">Pharmaceuticals</h2>
                  <p className="mt-5 max-w-md text-[15px] leading-7 text-neutral-600">We support companies reshaping health — enabling science and breakthroughs in prevention and treatment.</p>
                </>)}
                <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2">
                  <div className="writing-mode-vertical text-[11px] tracking-[0.25em] text-neutral-400">ECOSYSTEM</div>
                </div>
                <style jsx>{`.writing-mode-vertical { writing-mode: vertical-rl; text-orientation: mixed; }`}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return isDesktop ? DesktopView : MobileView;
}