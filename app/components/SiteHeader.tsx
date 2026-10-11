"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { InvestorGateModal } from "./InvestorGateModal";

type MenuItem = { label: string; href: string; match: (pathname: string) => boolean };

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

export function SiteHeader({ onApplyClick }: { onApplyClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      { label: "Portfolio", href: "/portfolio", match: (p) => p === "/portfolio" || p.startsWith("/portfolio/") },
      { label: "Manifesto", href: "/manifesto", match: (p) => p === "/manifesto" || p.startsWith("/manifesto/") },
      { label: "Apply", href: "/apply", match: (p) => p === "/apply" || p.startsWith("/apply/") },
    ],
    []
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-[22px] sm:text-[28px] lg:text-[38px] font-medium tracking-tight text-neutral-900">
          Elephant Invest
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-[15px] lg:text-[20px] text-neutral-700">
            <Link href="/portfolio" className="hover:text-neutral-900 transition">
              Portfolio
            </Link>
            <Link href="/manifesto" className="hover:text-neutral-900 transition">
              Manifesto
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="p-2 -mr-1 hover:opacity-70 transition flex items-center justify-center"
          >
            <div className="flex flex-col gap-[6px]">
              <span className="block h-[3px] w-8 sm:w-9 bg-neutral-900" />
              <span className="block h-[3px] w-8 sm:w-9 bg-neutral-900" />
              <span className="block h-[3px] w-8 sm:w-9 bg-neutral-900" />
            </div>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-white text-neutral-900" role="dialog" aria-modal="true">
          <div className="absolute right-6 sm:right-10 lg:right-20 top-6 sm:top-8">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="p-2 -mr-1 hover:opacity-70 transition flex items-center justify-center text-neutral-900"
            >
              <XIcon size={40} />
            </button>
          </div>

          <div className="h-full w-full px-6 sm:px-10 lg:px-20">
            <div className="h-full flex items-center justify-center">
              <div className="-translate-y-8 sm:-translate-y-10">
                <nav className="mx-auto flex max-w-5xl flex-col items-center gap-5 sm:gap-7 text-center">
                  {menuItems.map((item) => {
                    const isActive = item.match(pathname);
                    const className = [
                      "leading-[0.92] tracking-tight transition-colors font-semibold",
                      "text-[52px] sm:text-[72px] lg:text-[84px]",
                      isActive ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-900",
                    ].join(" ");

                    if (item.href === "/apply") {
                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            if (onApplyClick) {
                              onApplyClick();
                            } else {
                              setGateOpen(true);
                            }
                          }}
                          className={className}
                        >
                          {item.label}
                        </button>
                      );
                    }

                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={className}>
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-4 sm:mt-5 flex justify-center">
                  <div className="text-[14px] sm:text-[16px] lg:text-[18px] text-neutral-500 tracking-[0.18em]">
                    FOR ALLOCATION
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <InvestorGateModal isOpen={gateOpen} onClose={() => setGateOpen(false)} />
    </>
  );
}
