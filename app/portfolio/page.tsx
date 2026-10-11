"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "../components/SiteHeader";

type PortfolioCompany = {
  id: string;
  name: string;
  category: string;
  description: string;
  founders?: string[];
  profiles?: { label: string; href: string }[];
  logoSrc: string;
};

function XIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block">
      <path
        d="M6 6L18 18M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Locks body scroll WITHOUT causing the “page shifts sideways” effect (scrollbar disappears).
 * This is what was making the grid/header “move” when opening Palantir.
 */
function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}

export default function PortfolioPage() {
  const pathname = usePathname() || "/portfolio";

  const companies: PortfolioCompany[] = useMemo(
    () => [
      {
        id: "palantir",
        name: "Palantir",
        category: "ANALYTICS & SOFTWARE",
        description:
          "Palantir builds data integration and decision platforms used by governments and enterprises to operationalize complex data—supporting everything from defense and intelligence to commercial operations and AI-enabled workflows.",
        founders: ["Alexander Karp", "Peter Thiel"],
        profiles: [{ label: "Website", href: "https://www.palantir.com/" }],
        logoSrc: "/palantir.png",
      },
      {
        id: "united-healthcare",
        name: "United Healthcare",
        category: "HEALTHCARE",
        description:
          "UnitedHealthcare is a major health benefits provider offering insurance plans and services across individuals, employers, and government programs, aiming to improve access, affordability, and health outcomes.",
        founders: ["Richard T. Burke"],
        profiles: [{ label: "Website", href: "https://www.uhc.com/" }],
        logoSrc: "/unh1.png",
      },
      {
        id: "enphase",
        name: "Enphase",
        category: "ENERGY TECHNOLOGY",
        description:
          "Enphase develops solar and battery solutions, best known for microinverters and energy management software that help generate, store, monitor, and optimize electricity usage.",
        founders: ["Raghu Belur", "Martin Fornage"],
        profiles: [{ label: "Website", href: "https://enphase.com/" }],
        logoSrc: "/enphase1.png",
      },
      {
        id: "mara",
        name: "MARA",
        category: "DIGITAL INFRASTRUCTURE",
        description:
          "MARA operates large-scale digital infrastructure focused on bitcoin mining and energy-driven compute, building and running data centers designed for efficiency and long-term scalability.",
        profiles: [{ label: "Website", href: "https://www.mara.com/" }],
        logoSrc: "/mara1.png",
      },
      {
        id: "bitfarms",
        name: "Bitfarms",
        category: "DIGITAL INFRASTRUCTURE",
        description:
          "Bitfarms is a global bitcoin mining company that develops and operates data centers powered by energy infrastructure, focusing on operational efficiency and scale.",
        profiles: [{ label: "Website", href: "https://bitfarms.com/" }],
        logoSrc: "/bitfarms1.png",
      },
      {
        id: "cipher-mining",
        name: "Cipher Mining",
        category: "DIGITAL INFRASTRUCTURE",
        description:
          "Cipher develops and operates industrial-scale data centers for bitcoin mining and high-performance compute, emphasizing disciplined buildouts, efficiency, and reliable uptime.",
        profiles: [{ label: "Website", href: "https://www.ciphermining.com/" }],
        logoSrc: "/cyphermining1.png",
      },
      {
        id: "opendoor",
        name: "Opendoor",
        category: "REAL ESTATE TECHNOLOGY",
        description:
          "Opendoor is a digital real estate platform that helps homeowners sell on their timeline and buyers shop more seamlessly, using technology to simplify pricing, offers, and transactions.",
        profiles: [{ label: "Website", href: "https://www.opendoor.com/" }],
        logoSrc: "/opendoor1.png",
      },
      {
        id: "ionq",
        name: "IonQ",
        category: "QUANTUM COMPUTING",
        description:
          "IonQ builds quantum computing systems and provides cloud access and enterprise solutions, advancing practical quantum capabilities for future-ready computation and security use-cases.",
        founders: ["Christopher Monroe", "Jungsang Kim"],
        profiles: [{ label: "Website", href: "https://ionq.com/" }],
        logoSrc: "/ionq1.png",
      },
      {
        id: "peloton",
        name: "Peloton",
        category: "CONNECTED FITNESS",
        description:
          "Peloton creates connected fitness equipment and a subscription platform with instructor-led classes across cycling, running, and strength—bringing guided training into the home.",
        profiles: [{ label: "Website", href: "https://www.onepeloton.com/" }],
        logoSrc: "/peloton.png",
      },
      {
        id: "beyond-meat",
        name: "Beyond Meat",
        category: "FOOD & CONSUMER",
        description:
          "Beyond Meat produces plant-based protein products designed as alternatives to animal-based meat, aiming to deliver familiar taste and texture while supporting sustainability goals.",
        founders: ["Ethan Brown"],
        profiles: [{ label: "Website", href: "https://www.beyondmeat.com/" }],
        logoSrc: "/beyondmeat1.png",
      },
    ],
    []
  );

  // ===== Modal (company window) =====
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => companies.find((c) => c.id === selectedId) || null, [companies, selectedId]);

  // ✅ lock scroll once for either overlay (prevents “shift”)
  useLockBodyScroll(!!selectedId);

  // ESC closes modal (company window)
  useEffect(() => {
    if (!selectedId) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* ===============================
         TOP HEADER
      =============================== */}
      <section className="px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
        <SiteHeader />
      </section>

      {/* ===============================
         LOGO GRID
         ✅ When modal is open: keep EXACT same grid (no duplicate grid),
            just fade it a bit so the overlay reads clean.
      =============================== */}
      <div className="px-6 sm:px-10 lg:px-20 pt-24 pb-28">
        <div
          className={[
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-24 sm:gap-y-28 lg:gap-y-32 transition-opacity duration-200",
            selectedId ? "opacity-[0.22]" : "opacity-100",
          ].join(" ")}
          aria-hidden={!!selectedId}
        >
          {companies.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className="group w-full outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-4"
              aria-label={`Open ${c.name}`}
              disabled={!!selectedId}
            >
              <div className="mx-auto aspect-square w-full max-w-[360px] flex items-center justify-center relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#f4f4f4] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
                <div className="relative h-[40%] w-[70%]">
                  <Image
                    src={c.logoSrc}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
                    className="object-contain transition duration-200 ease-out group-hover:opacity-45"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===============================
         COMPANY MODAL WINDOW
         ✅ NO duplicate background grid anymore.
         ✅ No layout shift (scrollbar gap is preserved).
      =============================== */}
      {selected && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${selected.name} details`}>
          {/* Backdrop (transparent enough so the ORIGINAL grid stays visible, not duplicated) */}
          <button
            type="button"
            aria-label="Close company"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-white/88 backdrop-blur-[1px]"
          />

          {/* Close button (top-right), like Founders Fund) */}
          <div className="fixed right-6 sm:right-10 lg:right-20 top-6 sm:top-8 z-[70]">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="p-2 -mr-1 hover:opacity-70 transition flex items-center justify-center text-neutral-900"
              aria-label="Close company"
            >
              <XIcon size={40} />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-[65] px-6 sm:px-10 lg:px-20 pt-28 sm:pt-32 pb-28">
            <div className="max-w-[720px]">
              <div className="text-[13px] tracking-[0.18em] uppercase text-black/60">{selected.category}</div>

              <h1 className="mt-4 text-5xl sm:text-6xl font-semibold tracking-tight text-black">{selected.name}</h1>

              <p className="mt-6 text-[18px] leading-relaxed text-black/75">{selected.description}</p>

              {!!selected.founders?.length && (
                <div className="mt-14">
                  <div className="text-[16px] font-semibold text-black">Founders</div>
                  <div className="mt-3 space-y-2">
                    {selected.founders.map((f) => (
                      <div key={f}>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="inline-block border-b border-black/30 text-[18px] text-black/80 hover:text-black hover:border-black/60 transition"
                        >
                          {f}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!!selected.profiles?.length && (
                <div className="mt-14">
                  <div className="text-[16px] font-semibold text-black">Profiles</div>
                  <div className="mt-3 space-y-2">
                    {selected.profiles.map((p) => (
                      <div key={p.label}>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block border-b border-black/30 text-[18px] text-black/80 hover:text-black hover:border-black/60 transition"
                        >
                          {p.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
