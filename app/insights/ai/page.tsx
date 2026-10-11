// app/insights/ai/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "../../components/SiteHeader";

/** Founders Fund-style thick rule */
function Rule() {
  return <div className="h-[4px] w-[220px] bg-neutral-900" />;
}

/**
 * Full-bleed image section (breaks out of the max-width container)
 * - Expands to full viewport width
 * - Tall hero-style strip
 */
function FullBleedImage({
  src,
  alt = "",
  heightClass,
  priority,
}: {
  src: string;
  alt?: string;
  heightClass: string; // e.g. "h-[340px] sm:h-[420px] lg:h-[520px]"
  priority?: boolean;
}) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className={`relative w-full ${heightClass} overflow-hidden bg-black`}>
        <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[#0b1020]">
      {children}
    </div>
  );
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

export default function StrategyPage() {
  return (
    <main className="bg-white text-neutral-900">
      {/* ===============================
         HEADER
      =============================== */}
      <section className="px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
        <SiteHeader />
      </section>

      {/* ===============================
          TOP IMAGE — FULL BLEED + TALL (ONLY ONE IMAGE ON THIS PAGE)
      =============================== */}
      <section className="mt-6 sm:mt-8">
        <FullBleedImage src="/insights/ai.png" priority heightClass="h-[340px] sm:h-[420px] lg:h-[380px]" />
      </section>

      {/* ===============================
          TITLE BLOCK (Founders Fund-ish typography)
      =============================== */}
      <section className="px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-12">
          <div className="text-[14px] sm:text-[15px] tracking-[0.18em] text-neutral-500 font-medium">
            ELEPHANT INVEST — INSIGHTS
          </div>

          <h1 className="mt-6 text-[64px] sm:text-[86px] lg:text-[102px] leading-[0.92] tracking-tight font-extrabold text-neutral-900">
            Artificial Intelligence
          </h1>

          <div className="mt-7 text-[17px] sm:text-[18px] leading-[1.9] text-neutral-600 max-w-3xl">
            AI is becoming a new layer of infrastructure — not a product category. We invest where intelligence turns into
            durable leverage: embedded in systems, workflows, and economies that compound.
          </div>
        </div>
      </section>

      {/* ===============================
          BODY
      =============================== */}
      <section className="px-6 sm:px-10 lg:px-20 pb-24 sm:pb-28 lg:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 sm:mb-14">
            <div className="text-[18px] sm:text-[19px] text-neutral-600">Here is why.</div>
            <div className="mt-10">
              <Rule />
            </div>
          </div>

          {/* A. THE SHIFT */}
          <div className="mt-14 sm:mt-16">
            <SectionLabel>A. THE SHIFT</SectionLabel>
            <SectionH2>Intelligence is moving from labor to software</SectionH2>

            <Body>
              <p>
                For decades, software automated workflows. AI automates decisions.
                This is a more foundational shift: it changes how value is created, how costs scale, and how outcomes compound.
              </p>

              <p>
                In every major wave, the winners were not the loudest companies. They were the ones that became infrastructure —
                quietly embedded into the economy, difficult to replace, and increasingly essential.
              </p>

              <p className="font-semibold text-neutral-900">We believe AI follows the same pattern.</p>

              <Quote>
                AI is not a feature. It is a capability that rewires execution, speed, and competitiveness.
              </Quote>

              <p>
                The near-term narrative is noisy. But the long-term direction is clear: intelligence becomes cheaper,
                more available, and more deeply integrated — and the organizations that operationalize it earliest build durable edge.
              </p>
            </Body>
          </div>

          {/* B. WHAT MATTERS */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>B. WHAT MATTERS</SectionLabel>
            <SectionH2>Systems beat models</SectionH2>

            <Body>
              <p>
                Models improve rapidly. That is not the moat.
                The moat is everything around the model: distribution, data, workflow integration, feedback loops, and trust.
              </p>

              <p className="font-semibold text-neutral-900">We look for AI advantages that survive commoditization:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Proprietary data pipelines and defensible access to high-quality signals.</li>
                <li>Products that are operational — used in real workflows, not demos.</li>
                <li>Feedback loops that improve performance through usage.</li>
                <li>Integration points that create switching costs and long-term retention.</li>
                <li>Distribution that compounds (platforms, ecosystems, embedded channels).</li>
              </ul>

              <p>
                Most AI companies will not survive. The ones that do will look less like “AI startups” and more like
                infrastructure companies — with intelligence as their core capability.
              </p>
            </Body>
          </div>

          {/* C. WHERE WE INVEST */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>C. WHERE WE INVEST</SectionLabel>
            <SectionH2>Applied intelligence with measurable leverage</SectionH2>

            <Body>
              <p>
                We invest where AI creates concrete leverage — in time, cost, accuracy, and scale.
                The goal is not novelty. The goal is compounding advantage.
              </p>

              <p className="font-semibold text-neutral-900">We are especially drawn to domains where:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Software becomes an operator inside complex systems.</li>
                <li>Decision latency is expensive (finance, logistics, security, health).</li>
                <li>Data turns into execution, not reporting.</li>
                <li>Automation unlocks entirely new behavior, not incremental efficiency.</li>
              </ul>

              <p>
                We are not looking for “AI wrappers.” We are looking for businesses where intelligence is inseparable
                from the product — where the system improves with time and usage.
              </p>
            </Body>
          </div>

          {/* D. OUR PRINCIPLES */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>D. OUR PRINCIPLES</SectionLabel>
            <SectionH2>Conviction, restraint, and long horizons</SectionH2>

            <Body>
              <p>
                AI markets reward patience. The biggest outcomes are not created by chasing trends —
                they are created by building and backing systems that scale over years.
              </p>

              <p className="font-semibold text-neutral-900">Several principles guide our positioning:</p>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="font-extrabold text-neutral-900">1. Asymmetry First</div>
                  <div className="mt-2 text-neutral-700">
                    We prioritize situations where upside meaningfully exceeds downside — with clear paths to scale.
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900">2. Reality Over Narrative</div>
                  <div className="mt-2 text-neutral-700">
                    We underwrite real usage, real adoption, and real economics — not hype cycles.
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900">3. Systems Over Demos</div>
                  <div className="mt-2 text-neutral-700">
                    We prefer integrated products that execute inside workflows, not one-off model showcases.
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900">4. Long Duration</div>
                  <div className="mt-2 text-neutral-700">
                    We think in years, not quarters. Compounding requires time and discipline.
                  </div>
                </div>
              </div>

              <p>
                The future will not be built by prediction. It will be built by capability — and by the organizations
                that deploy intelligence reliably under real constraints.
              </p>
            </Body>
          </div>

          {/* E. CONCLUSION */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>E. CONCLUSION</SectionLabel>
            <SectionH2>Why this matters to Elephant Invest</SectionH2>

            <Body>
              <p>
                Elephant Invest exists to operate between two worlds: the world of deep technical possibility, and the world of capital.
              </p>

              <p className="font-semibold text-neutral-900">AI is where those two worlds are now colliding.</p>

              <p>
                Breakthroughs will continue. New categories will emerge. Entire workflows will be rewritten.
                The surface-level winners will change. The underlying direction will not.
              </p>

              <p>
                We invest with conviction. We operate with restraint. We focus on applied intelligence that becomes infrastructure —
                the kind that compounds quietly and becomes difficult to dislodge.
              </p>

              <p className="font-semibold text-neutral-900">
                We are not investing in a trend. We are investing in a long-duration shift.
              </p>
            </Body>

            <div className="mt-14">
              <Rule />
            </div>

            {/* ✅ kept EXACT same bottom block + Apply button as manifesto */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="text-neutral-500 text-[13px] sm:text-[14px] leading-[1.8] max-w-3xl">
                Past performance is not indicative of future results. Investments may lose value. No offer to sell or solicitation of an
                offer to buy securities is made hereby.
              </div>
              <Link
                href="/apply"
                className="shrink-0 inline-flex items-center justify-center rounded-full bg-black px-7 py-3.5 text-white hover:bg-neutral-800 transition"
              >
                Apply →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
