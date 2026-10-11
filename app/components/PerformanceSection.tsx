"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Metric = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  desc: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function useInViewOnce<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function formatNumber(n: number, decimals = 0) {
  const fixed = n.toFixed(decimals);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  start,
  durationMs = 900,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  start: boolean;
  durationMs?: number;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const from = 0;

    const tick = (t: number) => {
      const p = clamp((t - t0) / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (to - from) * eased;
      setVal(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, durationMs]);

  return (
    <span className="tabular-nums">
      {prefix}
      {formatNumber(val, decimals)}
      {suffix}
    </span>
  );
}

function useScrollProgress(sectionRef: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;

        const start = vh;
        const end = -r.height;
        const raw = (start - r.top) / (start - end);
        setP(clamp(raw, 0, 1));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRef]);

  return p;
}

// Real equity series from performance page
const EQUITY_SERIES = [
  { ts: new Date(Date.UTC(2025, 7, 14)).getTime(), equity: 3148808 },
  { ts: new Date(Date.UTC(2025, 8,  3)).getTime(), equity: 4477687 },
  { ts: new Date(Date.UTC(2025, 8, 23)).getTime(), equity: 8015852 },
  { ts: new Date(Date.UTC(2025, 9, 13)).getTime(), equity: 7366038 },
  { ts: new Date(Date.UTC(2025, 10, 2)).getTime(), equity: 5947326 },
  { ts: new Date(Date.UTC(2025, 10, 22)).getTime(), equity: 5589316 },
  { ts: new Date(Date.UTC(2025, 11, 1)).getTime(), equity: 7736274 },
];

function SparklineCard({ start, annualReturnPct = 153.49 }: { start: boolean; annualReturnPct?: number }) {
  const w = 360;
  const h = 220;
  const padX = 18;
  const padY = 18;

  const t0 = EQUITY_SERIES[0].ts;
  const t1 = EQUITY_SERIES[EQUITY_SERIES.length - 1].ts;
  const minEq = Math.min(...EQUITY_SERIES.map((p) => p.equity));
  const maxEq = Math.max(...EQUITY_SERIES.map((p) => p.equity));

  const toX = (ts: number) => padX + ((ts - t0) / (t1 - t0)) * (w - padX * 2);
  const toY = (eq: number) => padY + (1 - (eq - minEq) / (maxEq - minEq)) * (h - padY * 2);

  const pathD = useMemo(() => {
    const pts = EQUITY_SERIES.map((p) => ({ x: toX(p.ts), y: toY(p.equity) }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-[420px]">
      <div className="relative w-full rounded-[28px] bg-white/35 ring-1 ring-black/10 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 opacity-[0.55]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:36px_36px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:36px_36px]" />
        </div>

        <div className="relative z-10 px-6 pt-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.28em] text-black/55">EQUITY CURVE </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] tracking-[0.28em] text-black/55">MTD</div>
              <div className="mt-2 text-[26px] font-medium tracking-tight text-neutral-900 tabular-nums">
                +{formatNumber(annualReturnPct, 0)}%
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-4 pb-6 pt-4">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px] select-none">
            <path
              d={pathD}
              fill="none"
              stroke="rgba(0,0,0,0.75)"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="miter"
            />
            {EQUITY_SERIES.map((p, i) => (
              <circle
                key={i}
                cx={toX(p.ts)}
                cy={toY(p.equity)}
                r={3.5}
                fill="rgba(0,0,0,0.35)"
              />
            ))}
          </svg>

          <div className="px-2 pb-2">
            <div className="flex items-center justify-between text-[11px] text-black/55 tracking-[0.22em]">
              <span>AUG</span>
              <span>OCT</span>
              <span>DEC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-[11px] tracking-[0.28em] text-black/55">PERFORMANCE SIGNAL</div>
        <p className="mt-4 mx-auto max-w-xs text-[16px] leading-[1.55] text-neutral-800">
          A clear read of compounding — built on process, not prediction.
        </p>
      </div>
    </div>
  );
}

export default function PerformanceSection() {
  const leftMetric: Metric = {
  value: 139.12,
  suffix: "%",
  decimals: 0,
  label: "NET RETURN (AUG-DEC)",
  desc: "Net performance from August to December 2025 — measured on a marked + realized basis, net of internal costs and execution.",
};

const rightMetric: Metric = {
  value: 3.6,
  prefix: "$",
  suffix: "M",
  decimals: 1,
  label: "REALIZED GAINS (AUG-DEC)",
  desc: "Reported on realized exits. We prioritize repeatable process over one-off spikes and concentrated bets.",
};

  const { ref: perfRef, inView } = useInViewOnce<HTMLDivElement>(0.3);

  const portfolioRef = useRef<HTMLElement | null>(null);
  const prog = useScrollProgress(portfolioRef);

  const companies = useMemo(
    () => [
      {
        name: "Palantir",
        sources: [
          { src: "/video/palantir.webm", type: "video/webm" as const },
          { src: "/video/palantir.mp4", type: "video/mp4" as const },
        ],
      },
      {
        name: "United Healthcare",
        sources: [
          { src: "/video/unh.webm", type: "video/webm" as const },
          { src: "/video/unh.mp4", type: "video/mp4" as const },
        ],
      },
      {
        name: "Ionq",
        sources: [
          { src: "/video/ionq.webm", type: "video/webm" as const },
          { src: "/video/ionq.mp4", type: "video/mp4" as const },
        ],
      },
    ],
    []
  );

  return (
    <div className="relative bg-[#fbfaf7] overflow-x-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(1200px 760px at 16% 58%, rgba(168,216,238,0.50), rgba(168,216,238,0) 62%),
            radial-gradient(1200px 760px at 88% 58%, rgba(245,177,104,0.42), rgba(245,177,104,0) 62%),
            radial-gradient(980px 720px at 52% 20%, rgba(255,255,255,0.90), rgba(255,255,255,0) 58%)
          `,
        }}
      />

      {/* ===================== PERFORMANCE ===================== */}
      <section ref={perfRef} className="relative z-10 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 pt-20 sm:pt-24 lg:pt-28 pb-14 sm:pb-16 lg:pb-18">
          <div className="mt-0 relative">
            <div className="hidden xl:block absolute -left-24 top-1/2 -translate-y-1/2">
              <div className="[writing-mode:vertical-rl] [text-orientation:mixed] text-[60px] leading-none tracking-tight text-black/20 select-none">
                2025 Performance
              </div>
            </div>

            <div className="hidden xl:flex absolute -right-10 top-1/2 -translate-y-1/2 flex-col items-center">
              <div className="[writing-mode:vertical-rl] [text-orientation:mixed] text-[11px] tracking-[0.28em] text-black/45">
                ELEPHANT PERFORMANCE
              </div>
              <div className="mt-4 h-40 w-px bg-black/15" />
              <div className="mt-3 text-black/45">↓</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10 items-start">
              <Link href="/performance" className="group block" aria-label="View performance (left metric)">
                <div className="min-h-[320px] flex flex-col">
                  <div className="text-[72px] sm:text-[92px] md:text-[64px] lg:text-[96px] xl:text-[118px] leading-[0.9] tracking-tight text-neutral-900">
                    <CountUp
                      start={inView}
                      to={leftMetric.value}
                      prefix={leftMetric.prefix || ""}
                      suffix={leftMetric.suffix || ""}
                      decimals={leftMetric.decimals || 0}
                      durationMs={950}
                    />
                  </div>

                  <div className="mt-5 text-[11px] tracking-[0.28em] text-black/55">{leftMetric.label}</div>
                  <p className="mt-5 max-w-sm text-[16px] leading-[1.55] text-neutral-800">{leftMetric.desc}</p>

                  <div className="mt-auto pt-10">
                    <span className="inline-flex items-center gap-3 text-[12px] text-black/55 group-hover:text-black/75 transition">
                      View performance <span className="group-hover:translate-x-[1px] transition">→</span>
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/performance" className="group block" aria-label="View performance (equity curve)">
                <div className="min-h-[320px] flex flex-col items-center text-center">
                  <SparklineCard start={inView} annualReturnPct={leftMetric.value} />
                </div>
              </Link>

              <Link href="/performance" className="group block" aria-label="View performance (right metric)">
                <div className="min-h-[320px] flex flex-col items-start">
                  <div className="text-[72px] sm:text-[92px] md:text-[64px] lg:text-[96px] xl:text-[118px] leading-[0.9] tracking-tight text-neutral-900">
                    <CountUp
                      start={inView}
                      to={rightMetric.value}
                      prefix={rightMetric.prefix || ""}
                      suffix={rightMetric.suffix || ""}
                      decimals={rightMetric.decimals || 0}
                      durationMs={950}
                    />
                  </div>

                  <div className="mt-5 text-[11px] tracking-[0.28em] text-black/55">{rightMetric.label}</div>
                  <p className="mt-5 max-w-sm text-[16px] leading-[1.55] text-neutral-800">{rightMetric.desc}</p>

                  <div className="mt-auto pt-10">
                    <span className="inline-flex items-center gap-3 text-[12px] text-black/55 group-hover:text-black/75 transition">
                      View performance <span className="group-hover:translate-x-[1px] transition">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOFT MERGE INTO NEXT SECTION ===== */}
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-[320px]"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(251,250,247,0) 0%,
              rgba(251,250,247,0.65) 45%,
              rgba(251,250,247,0.95) 70%,
              rgba(251,250,247,1) 100%
            )
          `,
        }}
      />
    </div>
  );
}