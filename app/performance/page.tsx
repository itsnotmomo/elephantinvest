// app/performance/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "../components/SiteHeader";

const DATA_URL = "/data/transaction2025.csv";

const REPORT = {
  currency: "USD",
  initialCapital: 2_617_567,
  endingCapital: 6_272_198,
  netRealizedProfit: 3_654_631,
  roiPct: 139.62,
  netReturnPct: 136.24,
  capitalMultiple: 2.40,
  winRatePct: 67.03,
  profitFactor: 1.48,
};

type MenuItem = { label: string; href: string; match: (pathname: string) => boolean };

function XIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block">
      <path d="M6 6L18 18M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
    </svg>
  );
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function formatMoney(n: number, _currency = "USD") {
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(Math.round(n));
  const grouped = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);
  return `${sign}$${grouped}`;
}

function formatPct2(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(2)}%`;
}

function formatFloat2(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

function parseISOishDate(s: string): Date | null {
  const t = (s || "").trim();
  if (!t) return null;
  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) return d;
  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const d2 = new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
    if (!Number.isNaN(d2.getTime())) return d2;
  }
  return null;
}

function fmtDateLabel(dateStr: string) {
  const d = parseISOishDate(dateStr);
  if (!d) return dateStr || "—";
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);
  } catch {
    return dateStr;
  }
}

/* ----------------------------- CSV parsing ----------------------------- */

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function safeNum(s: string): number | undefined {
  if (s == null) return undefined;
  const t = String(s).trim();
  if (!t) return undefined;
  const cleaned = t.replace(/[€$£]/g, "").replace(/\s/g, "").replace(/,/g, "");
  const v = Number(cleaned);
  return Number.isFinite(v) ? v : undefined;
}

type TxRow = {
  date: string;
  description?: string;
  type?: string;
  symbol?: string;
  qty?: number;
  price?: number;
  fees?: number;
  realized?: number;
};

type Parsed = {
  currency: string;
  rows: TxRow[];
  sourceLabel: string;
};

function parseCsvAuto(text: string): Parsed {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const first = lines[0] ? splitCsvLine(lines[0]) : [];
  const looksSectioned = first[0] === "Transaction History" || first.includes("Transaction History");
  if (looksSectioned) return parseSectionedCsv(text);
  return parseHeaderCsv(text);
}

function parseSectionedCsv(text: string): Parsed {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  let currency = "USD";
  let txHeader: string[] | null = null;
  const rows: TxRow[] = [];

  for (const line of lines) {
    const cols = splitCsvLine(line);
    if (cols.length < 3) continue;
    const section = cols[0];
    const kind = cols[1];

    if (section === "Summary" && kind === "Data") {
      const fieldName = cols[2];
      const fieldValue = cols[3] ?? "";
      if (fieldName === "Basiswährung" && fieldValue) currency = fieldValue;
    }

    if (section !== "Transaction History") continue;
    if (kind === "Header") { txHeader = cols.slice(2); continue; }
    if (kind === "Data") {
      if (!txHeader) continue;
      const data = cols.slice(2);
      const get = (name: string) => {
        const idx = txHeader!.findIndex((h) => h.trim().toLowerCase() === name.trim().toLowerCase());
        return idx >= 0 ? data[idx] : "";
      };
      const date = get("Date");
      if (!date) continue;
      rows.push({
        date,
        description: get("Description") || undefined,
        type: get("Transaction Type") || undefined,
        symbol: get("Symbol") || undefined,
        qty: safeNum(get("Quantity")),
        price: safeNum(get("Price")),
        fees: safeNum(get("Commission")) ?? safeNum(get("Fees")) ?? safeNum(get("Commission ")),
        realized:
          safeNum(get("Realized_PnL")) ??
          safeNum(get("Realized PnL")) ??
          safeNum(get("Net Amount")) ??
          safeNum(get("Net Amount ")),
      });
    }
  }

  return { currency, rows, sourceLabel: `Loaded from ${DATA_URL}` };
}

function parseHeaderCsv(text: string): Parsed {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { currency: "USD", rows: [], sourceLabel: `Loaded from ${DATA_URL}` };

  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  const idxOf = (names: string[]) => {
    const lower = header.map((h) => h.toLowerCase());
    for (const n of names) {
      const i = lower.indexOf(n.toLowerCase());
      if (i >= 0) return i;
    }
    return -1;
  };

  const iDate   = idxOf(["date"]);
  const iSymbol = idxOf(["symbol", "ticker"]);
  const iType   = idxOf(["type", "transaction type", "side"]);
  const iQty    = idxOf(["qty", "quantity", "shares"]);
  const iPrice  = idxOf(["price"]);
  const iFees   = idxOf(["fees", "commission"]);
  const iReal   = idxOf(["realized_pnl", "realized pnl", "pnl"]);
  const iDesc   = idxOf(["description", "name"]);

  const rows: TxRow[] = [];
  for (let li = 1; li < lines.length; li++) {
    const cols = splitCsvLine(lines[li]);
    const date = iDate >= 0 ? cols[iDate] : "";
    if (!date) continue;
    rows.push({
      date,
      symbol:      iSymbol >= 0 ? cols[iSymbol] : undefined,
      type:        iType   >= 0 ? cols[iType]   : undefined,
      qty:         iQty    >= 0 ? safeNum(cols[iQty])   : undefined,
      price:       iPrice  >= 0 ? safeNum(cols[iPrice]) : undefined,
      fees:        iFees   >= 0 ? safeNum(cols[iFees])  : undefined,
      realized:    iReal   >= 0 ? safeNum(cols[iReal])  : undefined,
      description: iDesc   >= 0 ? cols[iDesc]   : undefined,
    });
  }

  return { currency: "USD", rows, sourceLabel: `Loaded from ${DATA_URL}` };
}

/* ----------------------------- Equity Chart ----------------------------- */

type EquityPoint = {
  date: string;
  ts: number;
  cumPnl: number;
  dayPnl: number;
  equity: number;
};

function useResizeObserver<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      setRect({ width: r.width, height: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, rect };
}

function EquityChart({ series, currency }: { series: EquityPoint[]; currency: string }) {
  const { ref, rect } = useResizeObserver<HTMLDivElement>();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const pad = { l: 18, r: 18, t: 18, b: 22 };

  const dims = useMemo(() => ({
    w: Math.max(0, rect.width),
    h: Math.max(0, rect.height),
  }), [rect.width, rect.height]);

  const domain = useMemo(() => {
    if (!series.length) return { min: 0, max: 1, t0: 0, t1: 1 };
    const min = Math.min(...series.map((p) => p.equity));
    const max = Math.max(...series.map((p) => p.equity));
    const t0 = series[0].ts;
    const t1 = series[series.length - 1].ts;
    return {
      min,
      max: max === min ? max + 1 : max,
      t0,
      t1: t1 === t0 ? t0 + 1 : t1,
    };
  }, [series]);

  const toX = (ts: number) => {
    const innerW = Math.max(1, dims.w - pad.l - pad.r);
    return pad.l + clamp((ts - domain.t0) / (domain.t1 - domain.t0), 0, 1) * innerW;
  };

  const toY = (equity: number) => {
    const innerH = Math.max(1, dims.h - pad.t - pad.b);
    return pad.t + (1 - clamp((equity - domain.min) / (domain.max - domain.min), 0, 1)) * innerH;
  };

  const polyPoints = useMemo(() => {
    if (!series.length || dims.w === 0 || dims.h === 0) return "";
    return series.map((p) => `${toX(p.ts).toFixed(2)},${toY(p.equity).toFixed(2)}`).join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, dims.w, dims.h, domain.min, domain.max, domain.t0, domain.t1]);

  const onMove = (evt: React.MouseEvent<SVGSVGElement>) => {
    if (!series.length) return;
    const svg = evt.currentTarget;
    const r = svg.getBoundingClientRect();
    const x = evt.clientX - r.left;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < series.length; i++) {
      const px = toX(series[i].ts);
      const d = Math.abs(px - x);
      if (d < bestD) { bestD = d; best = i; }
    }
    setHoverIdx(best);
  };

  const hover = hoverIdx != null ? series[hoverIdx] : null;
  const hoverX = hover ? toX(hover.ts) : 0;
  const hoverY = hover ? toY(hover.equity) : 0;

  return (
    <div ref={ref} className="h-[420px] sm:h-[460px] lg:h-[520px] w-full">
      <svg
        viewBox={`0 0 ${Math.max(1, dims.w)} ${Math.max(1, dims.h)}`}
        className="w-full h-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <polyline
          points={polyPoints}
          fill="none"
          stroke="rgba(0,0,0,0.85)"
          strokeWidth="3"
          strokeLinejoin="miter"
          strokeLinecap="round"
        />

        {dims.w > 0 && dims.h > 0 && series.map((p, i) => (
          <circle
            key={i}
            cx={toX(p.ts)}
            cy={toY(p.equity)}
            r={hoverIdx === i ? 5.5 : 3.5}
            fill={hoverIdx === i ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.35)"}
            style={{ transition: "r 0.1s, fill 0.1s" }}
          />
        ))}

        {hover && (
          <line
            x1={hoverX}
            y1={pad.t}
            x2={hoverX}
            y2={Math.max(pad.t, dims.h - pad.b)}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
          />
        )}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: clamp(hoverX + 14, 12, Math.max(12, dims.w - 200)),
            top: clamp(hoverY - 52, 12, Math.max(12, dims.h - 86)),
          }}
        >
          <div className="rounded-[16px] bg-white/80 ring-1 ring-black/10 backdrop-blur-sm px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="text-[11px] tracking-[0.22em] text-black/55">EQUITY</div>
            <div className="mt-1 text-[15px] font-medium text-neutral-900 tabular-nums">
              {formatMoney(hover.equity, currency)}
            </div>
            <div className="mt-2 text-[12px] text-neutral-700">
              <span className="text-black/55">Date:</span> {fmtDateLabel(hover.date)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Metric card ----------------------------- */

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[22px] bg-white ring-1 ring-black/15 p-6">
      <div className="text-[14px] text-neutral-900">{label}</div>
      <div className="mt-3 text-[22px] sm:text-[24px] font-medium tracking-tight text-neutral-900 tabular-nums">{value}</div>
      {sub ? <div className="mt-2 text-[12px] text-neutral-600">{sub}</div> : null}
    </div>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function PerformancePage() {
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sourceLabel, setSourceLabel] = useState("");

  const currency = REPORT.currency;

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`Could not load ${DATA_URL} (HTTP ${res.status})`);
        const text = await res.text();
        if (!alive) return;
        const parsed = parseCsvAuto(text);
        setSourceLabel(parsed.sourceLabel);
      } catch (e: any) {
        if (!alive) return;
        setLoadError(e?.message || "Could not load CSV.");
        setSourceLabel("");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const equitySeries: EquityPoint[] = useMemo(() => [
    { date: "2025-08-14", ts: new Date(Date.UTC(2025,  7, 14)).getTime(), cumPnl:       0, dayPnl: 0, equity: 2617567 },
    { date: "2025-09-03", ts: new Date(Date.UTC(2025,  8,  3)).getTime(), cumPnl: 1058659, dayPnl: 0, equity: 3676226 },
    { date: "2025-09-23", ts: new Date(Date.UTC(2025,  8, 23)).getTime(), cumPnl: 3877358, dayPnl: 0, equity: 6494925 },
    { date: "2025-10-13", ts: new Date(Date.UTC(2025,  9, 13)).getTime(), cumPnl: 3359680, dayPnl: 0, equity: 5977247 },
    { date: "2025-11-02", ts: new Date(Date.UTC(2025, 10,  2)).getTime(), cumPnl: 2229455, dayPnl: 0, equity: 4847022 },
    { date: "2025-11-22", ts: new Date(Date.UTC(2025, 10, 22)).getTime(), cumPnl: 1944245, dayPnl: 0, equity: 4561812 },
    { date: "2025-12-01", ts: new Date(Date.UTC(2025, 11,  1)).getTime(), cumPnl: 3654631, dayPnl: 0, equity: 6272198 },
  ], []);

  return (
    <main className="bg-[#fbfaf7] text-neutral-900">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1400px 900px at 78% 42%, rgba(245,177,104,0.24), rgba(245,177,104,0) 62%),
              radial-gradient(1200px 820px at 58% 58%, rgba(166,214,235,0.22), rgba(166,214,235,0) 64%),
              radial-gradient(1400px 900px at 96% 10%, rgba(255,255,255,0.85), rgba(255,255,255,0.30) 55%, rgba(255,255,255,0) 78%)
            `,
          }}
        />

        {/* Header */}
        <section className="relative px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8 pb-10">
          <SiteHeader />
        </section>

        {/* Content */}
        <section className="relative px-6 sm:px-10 lg:px-20 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-[14px] text-neutral-900 mb-6">Performance</div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

              {/* LEFT: chart card */}
              <div className="lg:col-span-7">
                <div className="relative rounded-[34px] bg-[#d9d9d9] ring-1 ring-black/15 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-[0.25]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[length:40px_40px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[length:40px_40px]" />
                  </div>

                  <div className="relative p-6 sm:p-7">
                    <div className="text-[13px] text-neutral-900">Equity curve (aug-dec)</div>

                    <div className="relative mt-4">
                      <div className="relative rounded-[26px] bg-white/25 ring-1 ring-black/10 overflow-hidden">
                        <EquityChart series={equitySeries} currency={currency} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CSV download */}
                <div className="mt-6">
                  <a
                    href={DATA_URL}
                    download
                    className="inline-flex items-center gap-3 rounded-full border border-black/15 bg-white/70 px-6 py-3 text-[13px] text-neutral-900 hover:bg-white transition"
                  >
                    Open transaction ledger (CSV)
                    <span className="text-black/45">→</span>
                  </a>

                  {sourceLabel ? <div className="mt-3 text-[12px] text-neutral-600">{sourceLabel}</div> : null}
                  {loadError ? <div className="mt-2 text-[12px] text-rose-700/80">{loading ? "Loading…" : loadError}</div> : null}
                </div>
              </div>

              {/* RIGHT: metric grid */}
              <div className="lg:col-span-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetricCard label="Percentage"       value={`+${formatPct2(REPORT.roiPct)}`}           sub="Return on investment (2025)" />
                  <MetricCard label="Realized"         value={formatMoney(REPORT.netRealizedProfit)}      sub="Net realized profit" />
                  <MetricCard label="Win rate"         value={formatPct2(REPORT.winRatePct)}              sub="Winning trades / (wins + losses)" />
                  <MetricCard label="Profit factor"    value={formatFloat2(REPORT.profitFactor)}          sub="Gross profit / gross loss" />
                  <MetricCard label="Capital multiple" value={`${formatFloat2(REPORT.capitalMultiple)}×`} sub="Ending / initial capital" />
                  <MetricCard label="Net return"       value={`+${formatPct2(REPORT.netReturnPct)}`}      sub="Net of all costs and execution" />
                </div>

                <div className="mt-6 text-[12px] text-neutral-600 leading-relaxed">
                  Metrics are reported from the strategy performance report. The equity curve is presented for the period Aug–Dec 2025. The chart is AI-generated; download the CSV table for the full transaction list from 14 August to 1 December.
                </div>
              </div>
            </div>
          </div>

          <div className="h-10" />
        </section>

      </div>
    </main>
  );
}