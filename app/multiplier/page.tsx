// app/multiplier/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "../components/SiteHeader";

type Tier = {
  id: string;
  label: string;
  min: number;
  max: number; // inclusive
  apr: number; // 0.314 = 31.4%
};

const TIERS: Tier[] = [
  { id: "t1", label: "$25,000 – $49,999", min: 25_000, max: 49_999, apr: 0.182 },
  { id: "t2", label: "$50,000 – $99,999", min: 50_000, max: 99_999, apr: 0.237 },
  { id: "t3", label: "$100,000 – $999,999", min: 100_000, max: 999_999, apr: 0.314 },
  { id: "t4", label: "$1,000,000 – $10,000,000", min: 1_000_000, max: 10_000_000, apr: 0.4 },
];

const YEARS = 4;
const MIN_INVEST = 25_000;
const MAX_INVEST = 10_000_000;

type Mode = "payout" | "compound";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function parseMoney(input: string) {
  const cleaned = input.replace(/[^\d]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function formatUSD(v: number) {
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatPct(v: number) {
  // show one decimal if needed
  const p = v * 100;
  const hasDecimal = Math.abs(p - Math.round(p)) > 1e-9;
  return `${hasDecimal ? p.toFixed(1) : p.toFixed(0)}%`;
}

function formatIntegerWithCommas(v: number) {
  if (!Number.isFinite(v) || v <= 0) return "";
  return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function findTier(amount: number): Tier | null {
  return TIERS.find((t) => amount >= t.min && amount <= t.max) ?? null;
}

type Row = {
  year: number;
  start: number;
  profit: number;
  end: number;
  cashReceived: number;
};

function buildRows(amount: number, apr: number, mode: Mode): Row[] {
  const rows: Row[] = [];
  let balance = amount;

  for (let y = 1; y <= YEARS; y++) {
    if (mode === "compound") {
      const start = balance;
      const profit = start * apr;
      const end = start + profit;
      rows.push({ year: y, start, profit, end, cashReceived: 0 });
      balance = end;
    } else {
      const start = amount;
      const profit = amount * apr;
      const end = amount;
      const cashReceived = y === YEARS ? profit + amount : profit;
      rows.push({ year: y, start, profit, end, cashReceived });
    }
  }

  return rows;
}

/** Mobile-safe SVG line chart */
function SimpleChart({
  payoutPoints,
  compoundPoints,
  highlight,
}: {
  payoutPoints: number[];
  compoundPoints: number[];
  highlight: Mode;
}) {
  const width = 860;
  const height = 250;
  const padX = 46;
  const padY = 30;

  const all = [...payoutPoints, ...compoundPoints].filter((n) => n > 0);
  const ymax = Math.max(...all, 1);
  const domainMax = Math.ceil(ymax / 10000) * 10000;

  const x = (i: number) => padX + (i * (width - padX * 2)) / (YEARS - 1);
  const y = (v: number) => padY + (height - padY * 2) * (1 - v / (domainMax || 1));

  const mk = (pts: number[]) => pts.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  const payoutPolyline = mk(payoutPoints);
  const compoundPolyline = mk(compoundPoints);

  const activeStroke = "#0b1020";
  const inactiveStroke = "rgba(11,16,32,0.18)";

  const payoutStroke = highlight === "payout" ? activeStroke : inactiveStroke;
  const compoundStroke = highlight === "compound" ? activeStroke : inactiveStroke;

  const payoutDash = highlight === "payout" ? undefined : "6 6";
  const compoundDash = highlight === "compound" ? undefined : "6 6";

  const gridLines = 4;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <div className="text-[16px] font-extrabold tracking-tight text-[#0b1020]">Projection</div>
          <div className="mt-1 text-[13px] text-neutral-500">End-of-year values (4-year contract)</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1",
              highlight === "payout" ? "border-neutral-900 text-neutral-900" : "border-neutral-200 text-neutral-500",
            ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-neutral-900" />
            Annual payouts
          </span>
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1",
              highlight === "compound" ? "border-neutral-900 text-neutral-900" : "border-neutral-200 text-neutral-500",
            ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-neutral-900" />
            Compound
          </span>
        </div>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[210px] w-full sm:h-[250px]" preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: gridLines + 1 }, (_, i) => {
            const val = (domainMax * (gridLines - i)) / gridLines;
            const yy = y(val);
            return (
              <g key={i}>
                <line x1={padX} y1={yy} x2={width - padX} y2={yy} stroke="rgba(11,16,32,0.08)" strokeWidth="1" />
                <text
                  x={padX}
                  y={yy - 7}
                  fontSize="11"
                  fill="rgba(11,16,32,0.45)"
                  fontFamily="ui-sans-serif, system-ui"
                >
                  {formatUSD(val)}
                </text>
              </g>
            );
          })}

          {Array.from({ length: YEARS }, (_, i) => (
            <text
              key={i}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(11,16,32,0.45)"
              fontFamily="ui-sans-serif, system-ui"
            >
              Y{i + 1}
            </text>
          ))}

          <polyline
            points={payoutPolyline}
            fill="none"
            stroke={payoutStroke}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={payoutDash}
          />
          <polyline
            points={compoundPolyline}
            fill="none"
            stroke={compoundStroke}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={compoundDash}
          />

          {payoutPoints.map((v, i) => (
            <circle
              key={`p-${i}`}
              cx={x(i)}
              cy={y(v)}
              r={4.75}
              fill={highlight === "payout" ? "#0b1020" : "rgba(11,16,32,0.22)"}
            />
          ))}
          {compoundPoints.map((v, i) => (
            <circle
              key={`c-${i}`}
              cx={x(i)}
              cy={y(v)}
              r={4.75}
              fill={highlight === "compound" ? "#0b1020" : "rgba(11,16,32,0.22)"}
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 text-[12px] leading-relaxed text-neutral-500">
        Annual payouts line shows <span className="font-semibold text-neutral-800">principal + cumulative payouts</span>. Compound line
        shows <span className="font-semibold text-neutral-800">compounded balance</span>.
      </div>
    </div>
  );
}

export default function MultiplierPage() {
  // ====== CALC ======
  const [mode, setMode] = useState<Mode>("payout");
  const [amountInput, setAmountInput] = useState("100,000");
  const [capNotice, setCapNotice] = useState(false);

  const amountRaw = useMemo(() => parseMoney(amountInput), [amountInput]);
  const amountClamped = useMemo(() => clamp(amountRaw, 0, MAX_INVEST), [amountRaw]);
  const tier = useMemo(() => findTier(amountClamped), [amountClamped]);
  const apr = tier?.apr ?? 0;

  const belowMin = amountRaw > 0 && amountRaw < MIN_INVEST;
  const aboveCap = amountRaw > MAX_INVEST; // should never happen now, but kept for safety

  const rows = useMemo(() => (tier ? buildRows(amountClamped, apr, mode) : []), [tier, amountClamped, apr, mode]);

  const yearlyProfit = useMemo(() => (tier ? amountClamped * apr : 0), [tier, amountClamped, apr]);

  const totalProfitPayout = useMemo(() => (tier ? amountClamped * apr * YEARS : 0), [tier, amountClamped, apr]);
  const totalReturnedPayout = useMemo(() => (tier ? amountClamped + totalProfitPayout : 0), [tier, amountClamped, totalProfitPayout]);

  const finalCompound = useMemo(() => (tier ? amountClamped * Math.pow(1 + apr, YEARS) : 0), [tier, amountClamped, apr]);
  const totalProfitCompound = useMemo(() => (tier ? finalCompound - amountClamped : 0), [tier, finalCompound, amountClamped]);

  const payoutPoints = useMemo(() => {
    if (!tier) return [0, 0, 0, 0];
    return [
      amountClamped + amountClamped * apr * 1,
      amountClamped + amountClamped * apr * 2,
      amountClamped + amountClamped * apr * 3,
      amountClamped + amountClamped * apr * 4,
    ];
  }, [tier, amountClamped, apr]);

  const compoundPoints = useMemo(() => {
    if (!tier) return [0, 0, 0, 0];
    return [
      amountClamped * Math.pow(1 + apr, 1),
      amountClamped * Math.pow(1 + apr, 2),
      amountClamped * Math.pow(1 + apr, 3),
      amountClamped * Math.pow(1 + apr, 4),
    ];
  }, [tier, amountClamped, apr]);

  return (
    <main className="bg-white text-neutral-900">
      {/* HEADER */}
      <section className="px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
        <SiteHeader />
      </section>

      {/* INTRO */}
      <section className="px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10">
          <div className="text-[14px] sm:text-[15px] tracking-[0.18em] text-neutral-500 font-medium">PRIVATE INVESTMENT FUND</div>

          <h1 className="mt-6 text-[44px] sm:text-[60px] lg:text-[72px] leading-[0.95] tracking-tight font-extrabold text-neutral-900">
            Multiplier
          </h1>

          <div className="mt-5 max-w-3xl text-[16px] sm:text-[17px] leading-[1.9] text-neutral-600">
            A clean projection tool to explain the 4-year contract:{" "}
            <span className="font-semibold text-neutral-900">annual payouts</span> vs{" "}
            <span className="font-semibold text-neutral-900">compounding</span>.
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 sm:px-10 lg:px-20 pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-5xl">
          {/* Tiers */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => {
              const active = tier?.id === t.id;
              return (
                <div
                  key={t.id}
                  className={[
                    "rounded-3xl border p-5 transition",
                    active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:border-neutral-300",
                  ].join(" ")}
                >
                  <div className={active ? "text-white/80 text-[12px]" : "text-neutral-500 text-[12px]"}>{t.label}</div>
                  <div className={["mt-3 text-[26px] font-extrabold tracking-tight", active ? "text-white" : "text-[#0b1020]"].join(" ")}>
                    {formatPct(t.apr)}
                    <span className={["text-[12px] font-semibold ml-2", active ? "text-white/70" : "text-neutral-500"].join(" ")}>
                      / year
                    </span>
                  </div>
                  <div className={active ? "mt-3 text-[12px] text-white/70" : "mt-3 text-[12px] text-neutral-500"}>
                    {formatUSD(t.min)} min{t.id === "t4" ? ` • cap ${formatUSD(t.max)}` : ""}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* Left */}
            <section className="lg:col-span-5">
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <div className="text-[16px] font-extrabold tracking-tight text-[#0b1020]">Calculator</div>
                    <div className="mt-1 text-[13px] text-neutral-500">Insert an amount. Everything updates instantly.</div>
                  </div>

                  <div className="flex">
                    {tier ? (
                      <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700">
                        Tier rate: <span className="font-semibold text-neutral-900">{formatPct(apr)}</span>
                      </span>
                    ) : (
                      <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">
                        Min {formatUSD(MIN_INVEST)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="mt-5">
                  <label className="text-[12px] font-semibold tracking-[0.12em] text-neutral-500">INVESTMENT AMOUNT</label>
                  <div className="mt-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400 text-lg">$</span>
                      <input
                        value={amountInput}
                        onChange={(e) => {
                          const n = parseMoney(e.target.value);
                          const capped = Math.min(n, MAX_INVEST);

                          setAmountInput(capped === 0 ? "" : formatIntegerWithCommas(capped));

                          // show a small notice when user tries to exceed cap
                          const triedAbove = n > MAX_INVEST;
                          setCapNotice(triedAbove);
                          if (triedAbove) {
                            window.clearTimeout((window as any).__cap_to);
                            (window as any).__cap_to = window.setTimeout(() => setCapNotice(false), 2200);
                          }
                        }}
                        inputMode="numeric"
                        className="w-full bg-transparent text-[20px] sm:text-[22px] font-extrabold tracking-tight text-[#0b1020] outline-none placeholder:text-neutral-300"
                        placeholder="100,000"
                      />
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-500">
                      <span>
                        Min {formatUSD(MIN_INVEST)} • Cap {formatUSD(MAX_INVEST)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAmountInput(formatIntegerWithCommas(clamp(amountClamped, MIN_INVEST, MAX_INVEST)))}
                        className="w-full sm:w-auto rounded-full border border-neutral-200 px-3 py-1 hover:bg-neutral-50 text-neutral-700"
                      >
                        Snap to range
                      </button>
                    </div>

                    {capNotice ? (
                      <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                        Limit is <span className="font-semibold text-neutral-900">{formatUSD(MAX_INVEST)}</span>.
                      </div>
                    ) : null}
                  </div>

                  {belowMin && (
                    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                      Minimum is {formatUSD(MIN_INVEST)} to qualify.
                    </div>
                  )}

                  {/* (aboveCap should never happen now, but left as a safety message) */}
                  {aboveCap && (
                    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                      This calculator is capped at {formatUSD(MAX_INVEST)}.
                    </div>
                  )}
                </div>

                {/* Mode */}
                <div className="mt-6">
                  <label className="text-[12px] font-semibold tracking-[0.12em] text-neutral-500">OPTION</label>
                  <div className="mt-3 grid gap-3">
                    <button
                      type="button"
                      onClick={() => setMode("payout")}
                      className={[
                        "rounded-2xl border px-4 py-4 text-left transition",
                        mode === "payout" ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      <div className="text-sm font-extrabold">Annual payouts</div>
                      <div className={["mt-1 text-xs leading-relaxed", mode === "payout" ? "text-white/75" : "text-neutral-500"].join(" ")}>
                        Profit paid yearly. Year 4 returns profit + principal.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("compound")}
                      className={[
                        "rounded-2xl border px-4 py-4 text-left transition",
                        mode === "compound" ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      <div className="text-sm font-extrabold">Compound</div>
                      <div className={["mt-1 text-xs leading-relaxed", mode === "compound" ? "text-white/75" : "text-neutral-500"].join(" ")}>
                        Profits reinvested yearly. Receive final amount in year 4.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-[12px] font-semibold tracking-[0.12em] text-neutral-500">YEARLY PROFIT</div>
                      <div className="mt-2 text-[20px] sm:text-[22px] font-extrabold tracking-tight text-[#0b1020]">
                        {tier ? formatUSD(yearlyProfit) : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[12px] font-semibold tracking-[0.12em] text-neutral-500">
                        {mode === "compound" ? "END OF YEAR 4" : "TOTAL PROFIT (4 YEARS)"}
                      </div>

                      <div className="mt-2 text-[20px] sm:text-[22px] font-extrabold tracking-tight text-[#0b1020]">
                        {tier ? (mode === "compound" ? formatUSD(finalCompound) : formatUSD(totalProfitPayout)) : "—"}
                      </div>

                      {tier && mode === "payout" ? (
                        <div className="mt-2 text-[12px] text-neutral-500">
                          Total returned incl. principal:{" "}
                          <span className="font-semibold text-neutral-900">{formatUSD(totalReturnedPayout)}</span>
                        </div>
                      ) : null}

                      {tier && mode === "compound" ? (
                        <div className="mt-2 text-[12px] text-neutral-500">
                          Total profit: <span className="font-semibold text-neutral-900">{formatUSD(totalProfitCompound)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-neutral-500 break-words">
                    {tier ? (
                      <>
                        Amount <span className="font-semibold text-neutral-900">{formatUSD(amountClamped)}</span> • Rate{" "}
                        <span className="font-semibold text-neutral-900">{formatPct(apr)}</span> • Term{" "}
                        <span className="font-semibold text-neutral-900">{YEARS} years</span>
                      </>
                    ) : (
                      <>Enter at least {formatUSD(MIN_INVEST)}.</>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Right */}
            <section className="lg:col-span-7">
              <SimpleChart payoutPoints={payoutPoints} compoundPoints={compoundPoints} highlight={mode} />

              <div className="mt-6 rounded-3xl border border-neutral-200 bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-neutral-200 px-5 sm:px-6 py-5">
                  <div>
                    <div className="text-[16px] font-extrabold tracking-tight text-[#0b1020]">4-year breakdown</div>
                    <div className="mt-1 text-[13px] text-neutral-500">
                      {mode === "compound" ? "Compounding projection (profits reinvested)." : "Payout projection (profits paid yearly)."}
                    </div>
                  </div>

                  <div className="w-full sm:w-auto rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-600">
                    Amount: <span className="font-semibold text-neutral-900">{amountRaw ? formatUSD(amountClamped) : "—"}</span>
                    {tier ? (
                      <>
                        {" "}
                        • Rate: <span className="font-semibold text-neutral-900">{formatPct(apr)}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="block sm:hidden px-5 py-5">
                  {tier ? (
                    <div className="space-y-3">
                      {rows.map((r) => (
                        <div key={r.year} className="rounded-2xl border border-neutral-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-extrabold text-[#0b1020]">Year {r.year}</div>
                            <div className="text-xs text-neutral-500">{mode === "compound" ? "Compound" : "Payout"}</div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-500">START</div>
                              <div className="mt-1 font-semibold text-neutral-800">{formatUSD(r.start)}</div>
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-500">PROFIT</div>
                              <div className="mt-1 font-semibold text-neutral-800">{formatUSD(r.profit)}</div>
                            </div>

                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-500">
                                {mode === "compound" ? "END" : "CAPITAL HELD"}
                              </div>
                              <div className="mt-1 font-semibold text-neutral-800">{formatUSD(r.end)}</div>
                            </div>

                            <div>
                              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-500">
                                {mode === "compound" ? "CASH PAID" : "CASH RECEIVED"}
                              </div>
                              <div className="mt-1 font-extrabold text-neutral-900">
                                {mode === "compound" ? "—" : formatUSD(r.cashReceived)}
                              </div>
                            </div>
                          </div>

                          {mode === "payout" && r.year === YEARS ? (
                            <div className="mt-3 text-[12px] text-neutral-500">Includes principal return in Year {YEARS}.</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-500">Enter at least {formatUSD(MIN_INVEST)} to see the breakdown.</div>
                  )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead>
                      <tr className="text-left text-xs font-semibold tracking-[0.10em] text-neutral-500">
                        <th className="px-6 py-4">YEAR</th>
                        <th className="px-6 py-4">START</th>
                        <th className="px-6 py-4">PROFIT</th>
                        <th className="px-6 py-4">{mode === "compound" ? "END BALANCE" : "CAPITAL HELD"}</th>
                        <th className="px-6 py-4">{mode === "compound" ? "CASH PAID" : "CASH RECEIVED"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tier ? (
                        rows.map((r) => (
                          <tr key={r.year} className="border-t border-neutral-200 text-sm">
                            <td className="px-6 py-4 text-neutral-700 font-semibold">Year {r.year}</td>
                            <td className="px-6 py-4 text-neutral-700">{formatUSD(r.start)}</td>
                            <td className="px-6 py-4 text-neutral-700">{formatUSD(r.profit)}</td>
                            <td className="px-6 py-4 text-neutral-700">{formatUSD(r.end)}</td>
                            <td className="px-6 py-4 font-extrabold text-neutral-900">{mode === "compound" ? "—" : formatUSD(r.cashReceived)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t border-neutral-200">
                          <td className="px-6 py-10 text-sm text-neutral-500" colSpan={5}>
                            Enter at least {formatUSD(MIN_INVEST)} to see the projection.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 sm:px-6 pb-6 pt-4 text-xs leading-relaxed text-neutral-500">
                  Internal: simplified projection math only (no fees/taxes shown). In payout mode, “cash received” includes principal return in Year {YEARS}.
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-50 px-5 sm:px-6 py-5">
                <div className="text-xs font-semibold tracking-[0.12em] text-neutral-500">QUICK NOTES</div>
                <div className="mt-3 text-sm text-neutral-700 leading-relaxed">
                  Term <span className="font-semibold text-neutral-900">{YEARS} years</span>. Minimum{" "}
                  <span className="font-semibold text-neutral-900">{formatUSD(MIN_INVEST)}</span>. Cap{" "}
                  <span className="font-semibold text-neutral-900">{formatUSD(MAX_INVEST)}</span>. Current input:{" "}
                  <span className="font-semibold text-neutral-900">{amountRaw ? `$${formatIntegerWithCommas(amountClamped)}` : "—"}</span>.
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

    </main>
  );
}