// app/manifesto/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";

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
          TOP IMAGE (image1) — FULL BLEED + TALL
      =============================== */}
      <section className="mt-6 sm:mt-8">
        <FullBleedImage src="/strategy/first.png" priority heightClass="h-[340px] sm:h-[420px] lg:h-[380px]" />
      </section>

      {/* ===============================
          TITLE BLOCK (Founders Fund-ish typography)
      =============================== */}
      <section className="px-6 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-12">
          <div className="text-[14px] sm:text-[15px] tracking-[0.18em] text-neutral-500 font-medium">ELEPHANT INVEST</div>

          <h1 className="mt-6 text-[64px] sm:text-[86px] lg:text-[102px] leading-[0.92] tracking-tight font-extrabold text-neutral-900">
            Manifesto
          </h1>

          <div className="mt-7 text-[17px] sm:text-[18px] leading-[1.9] text-neutral-600 max-w-3xl">
            We allocate capital to situations where reality and price are meaningfully out of alignment. We back progress
            that compounds, not narratives that fade. We exist to convert deep understanding into durable advantage.
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

          {/* A. INTRODUCTION */}
          <div className="mt-14 sm:mt-16">
            <SectionLabel>A. INTRODUCTION</SectionLabel>
            <SectionH2>The Problem</SectionH2>

            <Body>
              <p>Modern financial markets are extraordinarily liquid, extraordinarily fast, and yet surprisingly inefficient.</p>

              <p>
                Information moves instantly, but understanding does not. Capital moves everywhere, but conviction is scarce.
                Most investment activity today revolves around crowded trades, recycled themes, and incremental positioning
                inside already-validated narratives.
              </p>

              <p className="font-semibold text-neutral-900">The result is a paradox:</p>

              <div className="space-y-2">
                <div>Markets appear sophisticated, yet they routinely misprice change.</div>
              </div>

              <p className="font-semibold text-neutral-900">Elephant Invest was formed around a simple belief:</p>

              <Quote>The greatest opportunities emerge where complexity, neglect, and transformation intersect.</Quote>

              <p>
                We are not interested in participating in financial theater. We are interested in identifying real inflection
                points—moments where technology, regulation, innovation, or structural change alters the economic trajectory
                of a company or an industry.
              </p>

              <p className="font-semibold text-neutral-900">Our purpose is twofold:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>To compound capital responsibly over multi-year horizons.</li>
                <li>To support the advancement of systems, platforms, and enterprises that expand what is possible.</li>
              </ul>

              <p>
                These goals are not in conflict. Historically, they have been inseparable. The most enduring financial
                outcomes have always been generated by backing meaningful progress early, patiently, and with conviction.
              </p>
            </Body>
          </div>

          {/* Image before B (image2) */}
          <div className="mt-16 sm:mt-20">
            <FullBleedImage src="/strategy/secondo.png" heightClass="h-[340px] sm:h-[420px] lg:h-[520px]" />
          </div>

          {/* B. THE AGE OF NOISE */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>B. THE AGE OF NOISE</SectionLabel>

            <Body>
              <p>Markets today produce more data than ever before, but far less clarity.</p>

              <p>
                Endless commentary, algorithmic trading, social amplification, and short-term performance pressure have created an
                environment where most capital is deployed reactively rather than thoughtfully.
              </p>

              <p className="font-semibold text-neutral-900">This produces a familiar pattern:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Assets surge on narrative.</li>
                <li>Capital floods in late.</li>
                <li>Expectations overshoot reality.</li>
                <li>Disappointment follows.</li>
              </ul>

              <p className="font-semibold text-neutral-900">Elephant Invest does not operate inside this cycle.</p>

              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>We do not chase consensus.</li>
                <li>We do not optimize for quarterly optics.</li>
                <li>We do not build portfolios around fashionable themes.</li>
              </ul>

              <p className="font-semibold text-neutral-900">We operate where:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Coverage is thin.</li>
                <li>Understanding is incomplete.</li>
                <li>Outcomes are asymmetric.</li>
              </ul>

              <p>
                These environments are uncomfortable. They are also where edge still exists.
              </p>
            </Body>
          </div>

          {/* Image before C (image3) */}
          <div className="mt-16 sm:mt-20">
            <FullBleedImage src="/strategy/third.png" heightClass="h-[340px] sm:h-[420px] lg:h-[520px]" />
          </div>

          {/* C. REAL PROGRESS VS. DECORATIVE INNOVATION */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>C. REAL PROGRESS VS. DECORATIVE INNOVATION</SectionLabel>

            <Body>
              <p className="font-semibold text-neutral-900">Not all innovation is equal.</p>

              <p>Some advances reshape civilization. Others decorate existing systems.</p>

              <p className="font-semibold text-neutral-900">We focus on the former.</p>

              <p className="font-semibold text-neutral-900">Real progress tends to share certain characteristics:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>It solves fundamental constraints.</li>
                <li>It enables entirely new behavior.</li>
                <li>It scales beyond a single product cycle.</li>
              </ul>

              <p>
                Throughout history, the most valuable enterprises were not obvious at birth. They often appeared strange, risky,
                unnecessary, or premature. Yet, in hindsight, they became inevitable.
              </p>

              <p className="font-semibold text-neutral-900">We believe similar opportunities remain abundant today.</p>

              <p className="font-semibold text-neutral-900">In particular, we are drawn to domains where:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Software transforms physical systems.</li>
                <li>Biology becomes programmable.</li>
                <li>Data becomes operational rather than merely descriptive.</li>
                <li>Financial infrastructure becomes faster, cheaper, and more accessible.</li>
              </ul>

              <p>
                These shifts do not happen smoothly. They occur in bursts, through experimentation, failure, and eventual convergence.
                Elephant Invest positions capital ahead of that convergence.
              </p>
            </Body>
          </div>

          {/* Extra image to use all 5 (image4) — between C and D */}
          <div className="mt-16 sm:mt-20">
            <FullBleedImage src="/strategy/fourthh.png" heightClass="h-[340px] sm:h-[420px] lg:h-[520px]" />
          </div>

          {/* D. OUR WAY OF INVESTING */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>D. OUR WAY OF INVESTING</SectionLabel>

            <Body>
              <p>We do not view investing as prediction. We view it as probabilistic positioning.</p>

              <p>
                The future is unknowable in detail, but it is not random. Certain forces repeatedly shape outcomes:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Technological acceleration.</li>
                <li>Regulatory evolution.</li>
                <li>Capital cycles.</li>
                <li>Human incentives.</li>
              </ul>

              <p>
                Our process is designed to observe these forces early, synthesize them coherently, and deploy capital where their
                interaction creates mispricing.
              </p>

              <p className="font-semibold text-neutral-900">Several principles guide us:</p>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="font-extrabold text-neutral-900">1. Asymmetry First</div>
                  <div className="mt-2 text-neutral-700">We prefer situations where upside meaningfully exceeds downside.</div>
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900">2. Patience Over Activity</div>
                  <div className="mt-2 text-neutral-700">Capital does not need constant motion to compound.</div>
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900">3. Discipline Over Brilliance</div>
                  <div className="mt-2 text-neutral-700">Consistency outperforms occasional genius.</div>
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900">4. Adaptability Over Dogma</div>
                  <div className="mt-2 text-neutral-700">Markets evolve. So must we.</div>
                </div>
              </div>

              <p>
                We do not believe a single model explains reality. We believe robust frameworks, continuously refined, outperform rigid
                ideology.
              </p>
            </Body>
          </div>

          {/* Image before E (image5) */}
          <div className="mt-16 sm:mt-20">
            <FullBleedImage src="/strategy/fifth.png" heightClass="h-[340px] sm:h-[420px] lg:h-[520px]" />
          </div>

          {/* E. CONCLUSION */}
          <div className="mt-16 sm:mt-20">
            <SectionLabel>E. CONCLUSION</SectionLabel>
            <SectionH2>Our Role</SectionH2>

            <Body>
              <p>
                Elephant Invest exists to operate between two worlds: the world of deep technical possibility, and the world of financial
                capital.
              </p>

              <p className="font-semibold text-neutral-900">Our role is to translate one into the other.</p>

              <p>We do not claim to know precisely what the future will look like.</p>

              <p className="font-semibold text-neutral-900">We do claim to know this:</p>

              <div className="space-y-2">
                <div>Progress will continue.</div>
                <div>Breakthroughs will occur.</div>
                <div>Entire categories will be reinvented.</div>
                <div>New leaders will emerge.</div>
              </div>

              <p>
                Capital that is patient, curious, disciplined, and willing to engage with complexity will be rewarded. That is the capital
                we seek to be.
              </p>

              <p>
                We invest with conviction. We operate with restraint. We think in years, not quarters.
              </p>

              <p className="font-semibold text-neutral-900">
                Elephant Invest is not built to follow markets. It is built to move ahead of them.
              </p>
            </Body>

            <div className="mt-14">
              <Rule />
            </div>

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
