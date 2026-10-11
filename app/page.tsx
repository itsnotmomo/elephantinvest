import Link from "next/link";
import Image from "next/image";
import React from "react";

import EcosystemStacks from "./components/EcosystemStacks";
import FeatureWithNewsletter from "./components/FeatureWithNewsletter";
import PerformanceSection from "./components/PerformanceSection";
import PortfolioPinnedSection from "./components/PortfolioPinnedSection";
import BottomNewsletterSection from "./components/BottomNewsletterSection";
import { InvestorGateWrapper } from "./components/InvestorGateWrapper";
import { WorkWithUsButton } from "./components/WorkWithUsButton";

const latest = [
  { title: "Fintech infrastructure", desc: "Rebuilding the rails of the global financial system." },
  { title: "Intelligent systems", desc: "AI and software reshaping how decisions are made." },
  { title: "Life sciences", desc: "Biotech and pharmaceuticals defining the next decade of health." },
];

type Holding = {
  src?: string; // optional so we can include all 9 without breaking if a logo file isn't ready yet
  name: string;
  ticker: string;
};

function HoldingCard({
  holding,
  variant = "md",
}: {
  holding: Required<Pick<Holding, "src" | "name" | "ticker">>;
  variant?: "featured" | "tall" | "md";
}) {
  const shell = "relative rounded-[28px] ring-1 ring-black/10 bg-white/14 backdrop-blur-[6px]";
  const pad =
    variant === "featured" ? "p-8 lg:p-9" : variant === "tall" ? "p-7 lg:p-8" : "p-6 lg:p-7";
  const logoBox =
    variant === "featured"
      ? "h-[105px] lg:h-[115px] xl:h-[120px]"
      : variant === "tall"
      ? "h-[95px] lg:h-[105px] xl:h-[110px]"
      : "h-[88px] lg:h-[96px] xl:h-[100px]";

  return (
    <div className={shell}>
      <div className={["h-full w-full", pad].join(" ")}>
        <div className={["relative w-full", logoBox].join(" ")}>
          <Image src={holding.src} alt={holding.name} fill className="object-contain" />
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-6">
          <div className="text-[14px] lg:text-[15px] font-medium text-neutral-900">{holding.name}</div>
          <div className="text-[11px] tracking-[0.22em] text-neutral-600">{holding.ticker}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Snapshot pill used in the moving ribbon (tablet/phone).
 * - supports holdings with or without src
 * - never clips
 */
function SnapshotPill({ h }: { h: Holding }) {
  return (
    <div className="flex-shrink-0 rounded-full ring-1 ring-black/10 bg-white/18 backdrop-blur-[6px] px-5 py-3">
      <div className="flex items-center gap-3">
        {h.src ? (
          <div className="relative h-6 w-24">
            <Image
              src={h.src}
              alt={h.name}
              fill
              className="object-contain"
              loading="eager"
            />
          </div>
        ) : (
          <div className="text-[12px] font-medium text-neutral-900 whitespace-nowrap">{h.name}</div>
        )}
        <div className="text-[11px] tracking-[0.22em] text-neutral-600">{h.ticker}</div>
      </div>
    </div>
  );
}

/**
 * Mobile/Tablet portfolio snapshot (shows below lg)
 * Changes:
 * - NO ugly white overlays left/right
 * - uses mask-image to fade edges (clean + minimal)
 * - NEVER pauses (removed hover pause)
 * - shows ALL 9 holdings
 */
function PortfolioSnapshotMobile({ items }: { items: Holding[] }) {
  // duplicate for seamless loop
  const loop = [...items, ...items];

  return (
    <div className="lg:hidden mt-10">
      <div className="flex items-center justify-between gap-6">
        <div className="text-[11px] tracking-[0.22em] text-neutral-700">PORTFOLIO SNAPSHOT</div>
        <Link href="/portfolio" className="text-[12px] font-medium text-neutral-800 hover:underline">
          View portfolio →
        </Link>
      </div>

      <div className="mt-5">
        <div className="ei-marqueeMask">
          <div className="ei-track" aria-hidden="true">
            {loop.map((h, i) => (
              <SnapshotPill key={`${h.ticker}-${i}`} h={h} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  /**
   * Snapshot: ALL 9 holdings (tablet/phone)
   * - If you already have logo files for the extra 4, put src paths in.
   * - If not, it will still render cleanly using the name + ticker (no broken UI).
   */
  const snapshotHoldings: Holding[] = [
    { src: "/unh1.png", name: "UnitedHealth", ticker: "UNH" },
    { src: "/palantir.png", name: "Palantir", ticker: "PLTR" },
    { src: "/cyphermining1.png", name: "Cipher Mining", ticker: "CIFR" },
    { src: "/ionq1.png", name: "IonQ", ticker: "IONQ" },
    { src: "/peloton.png", name: "Peloton", ticker: "PTON" },
    { src: "/mara1.png", name: "Mara", ticker: "MARA" },
    { src: "/bitfarms1.png", name: "Bitfarms", ticker: "BITF" },
    { src: "/beyondmeat1.png", name: "Beyond Meat", ticker: "BYND" },
    { src: "/enphase1.png", name: "Enphase", ticker: "ENPH" },

  ];

  // Desktop cards: minimal 3 only (Farhan)
  const PLTR = { src: "/palantir.png", name: "Palantir", ticker: "PLTR" } as const;
  const CIFR = { src: "/cyphermining1.png", name: "Cipher Mining", ticker: "CIFR" } as const;
  const OPEN = { src: "/opendoor1.png", name: "Opendoor", ticker: "OPEN" } as const;

  return (
    <main className="bg-[#fbfaf7] text-neutral-900">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1500px 900px at 80% 40%, rgba(245,177,104,0.75), rgba(245,177,104,0) 60%),
              radial-gradient(1300px 900px at 55% 55%, rgba(166,214,235,0.85), rgba(166,214,235,0) 62%),
              radial-gradient(1700px 900px at 95% 15%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 75%)
            `,
          }}
        />

        {/* ===============================
           SECTION 1 — HERO
        =============================== */}
        <InvestorGateWrapper className="relative min-h-[92vh] px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
          <div className="mt-12 sm:mt-16 lg:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7">
              <h1 className="text-[56px] sm:text-[78px] lg:text-[110px] leading-[0.92] tracking-tight">
                Shaping
                <br />
                tomorrow’s
                <br />
                capital.
              </h1>

              <p className="mt-8 sm:mt-10 lg:mt-16 max-w-2xl text-[15px] sm:text-[17px] lg:text-[20px] text-neutral-700">
                Elephant Invest is a private investment vehicle built to identify and support the next generation of
                transformative companies across technology, fintech and life sciences.
              </p>

              <div className="mt-10 sm:mt-12 lg:mt-16 flex items-center gap-6 sm:gap-10">
                <WorkWithUsButton variant="hero" />
                <Link href="/portfolio" className="text-[14px] sm:text-[15px] font-medium text-neutral-800 hover:underline">
                  View portfolio
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="text-[11px] tracking-[0.22em] text-neutral-700">FOCUS</div>
              <div className="mt-8 sm:mt-10 lg:mt-14 space-y-10 sm:space-y-12 lg:space-y-16">
                {latest.map((x) => (
                  <div key={x.title}>
                    <div className="text-[18px] sm:text-[20px] lg:text-[22px] font-medium">{x.title}</div>
                    <div className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-700">
                      {x.desc}
                    </div>
                    <div className="mt-8 sm:mt-10 lg:mt-12 h-px bg-black/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InvestorGateWrapper>

        {/* ===============================
           SECTION 2 — VISION
           Fixes:
           - better small-desktop layout
           - better alignment
           - snapshot is clean + 9 holdings + never pauses
        =============================== */}
        <section className="relative px-6 sm:px-10 lg:px-20 pt-16 sm:pt-20 lg:pt-28 pb-14 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 lg:items-center">
            {/* Left: more width on small desktop (lg) */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="text-[11px] tracking-[0.22em] text-neutral-700">OUR VISION</div>

              <h2 className="mt-6 sm:mt-8 lg:mt-10 text-[38px] sm:text-[52px] lg:text-[54px] xl:text-[64px] leading-[1.06] tracking-tight">
                We believe in the transformative power of technology — and that constant evolution is the most durable
                advantage.
              </h2>

              <PortfolioSnapshotMobile items={snapshotHoldings} />
            </div>

            {/* Right: minimal 3 holdings (desktop only) */}
            <div className="lg:col-span-6 xl:col-span-7 hidden lg:block self-center">
              <div className="grid grid-cols-12 gap-6 xl:gap-7">
                <div className="col-span-12">
                  <div className="h-[235px] xl:h-[255px]">
                    <HoldingCard holding={PLTR} variant="featured" />
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="h-[195px] xl:h-[210px]">
                    <HoldingCard holding={CIFR} variant="md" />
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="h-[195px] xl:h-[210px]">
                    <HoldingCard holding={OPEN} variant="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Centered copy + CTA */}
          <div className="mt-10 lg:mt-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-700 leading-[1.8]">
                We back companies shaping the next decade of critical systems: the future of finance, intelligence, and
                health.
              </p>

              <div className="mt-7 sm:mt-8 flex justify-center">
                <WorkWithUsButton variant="vision" />
              </div>
            </div>
          </div>
        </section>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#fbfaf7]" />
      </div>

      {/* ===============================
         REST OF PAGE
      =============================== */}
      <div className="-mt-8 sm:-mt-10 lg:-mt-12">
        <EcosystemStacks />
      </div>
      <FeatureWithNewsletter />
      <PerformanceSection />
      <PortfolioPinnedSection />
      <BottomNewsletterSection />
    </main>
  );
}
