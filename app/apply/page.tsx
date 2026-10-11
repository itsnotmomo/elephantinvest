// app/apply/page.tsx
import React from "react";
import { SiteHeader } from "../components/SiteHeader";
import TallyForm from "./TallyForm";

/** Founders Fund-ish thick rule */
function Rule() {
  return <div className="h-[4px] w-[220px] bg-neutral-900" />;
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 sm:mb-3 text-[14px] sm:text-[15px] tracking-[0.18em] text-neutral-500 font-medium">{children}</div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mt-12 pb-6 sm:mt-6 sm:pb-0 text-[54px] sm:text-[78px] lg:text-[92px] leading-[0.98] sm:leading-[0.92] tracking-tight font-extrabold text-neutral-900">
      {children}
    </h1>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <div className="mt-7 text-[17px] sm:text-[18px] leading-[1.9] text-neutral-600 max-w-3xl">{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[#0b1020]">{children}</div>;
}

function SectionH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 text-[34px] sm:text-[40px] lg:text-[44px] leading-[1.05] font-extrabold tracking-tight text-[#0b1020]">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 space-y-6 text-[16px] sm:text-[17px] leading-[1.95] text-neutral-700">{children}</div>;
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 border-l-[4px] border-neutral-900 pl-6">
      <div className="text-[20px] sm:text-[22px] leading-[1.5] font-semibold text-neutral-900">{children}</div>
    </div>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-[22px] bg-white ring-1 ring-black/10 p-6 sm:p-7">
      <div className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-neutral-900">{value}</div>
      <div className="mt-2 text-[12px] tracking-[0.22em] text-black/55">{label}</div>
      {sub ? <div className="mt-3 text-[14px] leading-[1.75] text-neutral-700">{sub}</div> : null}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] bg-white ring-1 ring-black/10 p-6 sm:p-7">
      <div className="text-[12px] tracking-[0.22em] text-black/55">{title}</div>
      <div className="mt-4 text-[16px] leading-[1.85] text-neutral-800">{children}</div>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-[7px] h-2.5 w-2.5 rounded-full bg-neutral-900" />
      <div className="text-[16px] sm:text-[17px] leading-[1.9] text-neutral-700">{children}</div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <main className="bg-[#fbfaf7] text-neutral-900">
      <div className="relative overflow-hidden">
        {/* Soft background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(1200px 760px at 18% 22%, rgba(168,216,238,0.30), rgba(168,216,238,0) 62%),
              radial-gradient(1200px 760px at 86% 30%, rgba(245,177,104,0.26), rgba(245,177,104,0) 62%),
              radial-gradient(980px 720px at 52% 20%, rgba(255,255,255,0.90), rgba(255,255,255,0) 58%)
            `,
          }}
        />

        {/* ===============================
           HEADER
        =============================== */}
        <section className="relative px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
          <SiteHeader />
        </section>

        {/* ===============================
            HERO
        =============================== */}
        <section className="relative px-6 sm:px-10 lg:px-20">
          <div className="mx-auto max-w-5xl pt-16 sm:pt-16 lg:pt-20 pb-12 sm:pb-12">
            <Kicker>ELEPHANT INVEST</Kicker>
            <H1>Apply for allocation</H1>

            <Lead>
              We run a focused, catalyst-driven equity strategy designed to capture asymmetric outcomes where information is uneven,
              coverage is thin, and pricing lags reality. If you’re looking for a high-convexity vehicle with a disciplined process and
              institutional-grade standards, you’re in the right place.
            </Lead>

            <div className="mt-10">
              <Rule />
            </div>
          </div>
        </section>

        {/* ===============================
            BODY
        =============================== */}
        <section className="relative px-6 sm:px-10 lg:px-20 pb-24 sm:pb-28 lg:pb-32">
          <div className="mx-auto max-w-5xl">
            <div className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Stat value="Event-driven" label="MANDATE" sub="Catalysts, dislocations, and mispricing — not narratives." />
                <Stat value="Selective" label="POSITIONING" sub="We deploy only when the setup is clean and the edge is real." />
                <Stat value="Disciplined" label="RISK" sub="Exposure control, rule-driven lifecycle, and tight capital efficiency." />
              </div>

              <div className="mt-10">
                <Quote>Our job is simple: identify where reality is changing faster than price — and position early, with discipline.</Quote>
              </div>
            </div>

            <div className="mt-16 sm:mt-20">
              <SectionLabel>1. THE FUND</SectionLabel>
              <SectionH2>What we do</SectionH2>

              <Body>
                <p>
                  Elephant Invest is a focused equity vehicle built for high-quality opportunities in public markets — particularly in
                  short and mid-cap names where catalysts create meaningful dislocations and where edge decays quickly.
                </p>

                <p className="font-semibold text-neutral-900">We concentrate on three domains:</p>
                <div className="mt-6 space-y-4">
                  <CheckItem>
                    <span className="font-semibold text-neutral-900">Technology</span> — platform inflections, adoption curves, and
                    structural rerates.
                  </CheckItem>
                  <CheckItem>
                    <span className="font-semibold text-neutral-900">Fintech</span> — regulation + distribution shifts, capital cycles, and
                    market structure changes.
                  </CheckItem>
                  <CheckItem>
                    <span className="font-semibold text-neutral-900">Pharma / Biotech</span> — milestone-driven repricing across clinical and
                    regulatory timelines.
                  </CheckItem>
                </div>

                <p>
                  The aim is not to own everything. The aim is to own the <span className="font-semibold text-neutral-900">right things at the right time</span>{" "}
                   — and realize gains when the catalyst
                  resolves.
                </p>
              </Body>
            </div>

            <div className="mt-16 sm:mt-20">
              <SectionLabel>2. THE EDGE</SectionLabel>
              <SectionH2>Why this works</SectionH2>

              <Body>
                <p>
                  Large funds struggle to capture this category of opportunity. Their decision cycles are slow, their size creates
                  friction, and their mandate often prevents them from operating where information is uneven and liquidity is fragmented.
                </p>

                <p className="font-semibold text-neutral-900">Our edge is built on:</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Card title="INFORMATION FLOW">
                    We track catalysts and market structure signals where coverage is thin and the repricing window is short.
                  </Card>
                  <Card title="RESEARCH DEPTH">
                    We do deep, specific work — technical, fundamental, and narrative dissection — to isolate mispricing from noise.
                  </Card>
                  <Card title="EXECUTION AGILITY">
                    We can move quickly and precisely, building positions with minimal footprint and reducing exposure as the trade matures.
                  </Card>
                  <Card title="CAPITAL EFFICIENCY">
                    We keep capital mobile. If progression stalls, we reduce or exit — opportunity cost is treated as real risk.
                  </Card>
                </div>
              </Body>
            </div>

            <div className="mt-16 sm:mt-20">
              <SectionLabel>3. PROCESS</SectionLabel>
              <SectionH2>How we invest</SectionH2>

              <Body>
                <p>
                  Our process is a discretionary–systematic hybrid. Research and catalyst identification are discretionary; timing, sizing,
                  and trade lifecycle management follow rule-based protocols designed for volatility regimes and liquidity patterns.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Card title="SOURCE → FILTER → VALIDATE">
                    We originate ideas, filter for asymmetry, and validate probability + liquidity feasibility before a position is built.
                  </Card>
                  <Card title="PRE-EVENT POSITIONING">
                    Positions are built in narrow accumulation windows with controlled execution to optimize average entry quality.
                  </Card>
                  <Card title="REGIME-ADAPTIVE SIZING">
                    Exposure expands only when signal quality is high and compresses when conditions deteriorate — removing emotional sizing.
                  </Card>
                  <Card title="EXIT DESIGN">
                    Profits are realized through tiered de-risking logic. The goal is realized expectancy, not maximum duration.
                  </Card>
                </div>
              </Body>
            </div>

            <div className="mt-16 sm:mt-20">
              <SectionLabel>4. ALLOCATION</SectionLabel>
              <SectionH2>Apply for allocation</SectionH2>

              <Body>
                <p>
                  We review applications manually. We maintain a minimum required allocation to consider a client. If you’re below the
                  current threshold, you can still apply — we’ll place you on the waitlist and reach out when capacity opens.
                </p>

                <div className="mt-10">
                  <Rule />
                </div>

                <TallyForm />
              </Body>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}