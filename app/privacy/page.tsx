"use client";

// app/privacy/page.tsx
// Elephant Invest — Privacy Policy
// Header is identical to the Portfolio page (white bg, same nav, same hamburger + fullscreen overlay)

import Link from "next/link";
import React from "react";
import { SiteHeader } from "../components/SiteHeader";

// ─── privacy sections ─────────────────────────────────────────────────────────
const sections = [
  {
    id: "01",
    title: "Information We Collect",
    content: [
      "We collect information you provide directly, including name, email address, professional background, and materials submitted through application forms, newsletter sign-ups, or direct correspondence. We may also collect technical data automatically — including IP address, browser type, device information, and pages visited — via standard server logs and analytics.",
    ],
  },
  {
    id: "02",
    title: "How We Use Your Information",
    content: [
      "Personal information is used to evaluate applications for participation in Elephant Invest, communicate with prospective and existing participants, send newsletters and investment updates where subscribed, and maintain platform security. We do not use personal data for advertising or sell it to third parties under any circumstance.",
    ],
  },
  {
    id: "03",
    title: "Legal Basis for Processing",
    content: [
      "Where applicable data protection law applies, we process your personal data on the basis of legitimate interests in operating a private investment vehicle, consent where you have subscribed to communications, and compliance with legal obligations where required.",
    ],
  },
  {
    id: "04",
    title: "Data Sharing",
    content: [
      "We do not sell, rent, or trade personal information. Data may be shared with service providers who support platform operations (such as email infrastructure) under strict confidentiality obligations. We may disclose data if required by law or to protect the rights and safety of Elephant Invest and its participants.",
    ],
  },
  {
    id: "05",
    title: "Data Retention",
    content: [
      "We retain personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. Application data is retained for a minimum of two years. Newsletter subscriber data is retained until you unsubscribe. You may request deletion at any time.",
    ],
  },
  {
    id: "06",
    title: "Your Rights",
    content: [
      "Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data; withdraw consent at any time; object to or restrict processing; and request data portability. To exercise any of these rights, contact us through the application portal.",
    ],
  },
  {
    id: "07",
    title: "Cookies",
    content: [
      "This platform uses minimal cookies necessary for basic functionality and analytics. We do not use tracking cookies for advertising. You can manage cookie preferences at any time via the Cookie Preferences link in the site footer.",
    ],
  },
  {
    id: "08",
    title: "Security",
    content: [
      "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. However, no system is entirely secure and we cannot guarantee absolute security of data transmitted over the internet.",
    ],
  },
  {
    id: "09",
    title: "International Transfers",
    content: [
      "Your data may be processed in countries outside your jurisdiction. Where such transfers occur, we take steps to ensure appropriate safeguards are in place in accordance with applicable data protection law.",
    ],
  },
  {
    id: "10",
    title: "Contact",
    content: [
      "For questions about this Privacy Policy or to exercise your data rights, please contact us through the application portal or through your designated point of contact within Elephant Invest.",
    ],
  },
];

// ─── page ─────────────────────────────────────────────────────────────────────
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================================
          HEADER — exact copy of Portfolio header
      ===================================================================== */}
      <section className="px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
        <SiteHeader />
      </section>

      {/* =====================================================================
          PAGE CONTENT
      ===================================================================== */}
      <div className="px-6 sm:px-10 lg:px-20 pt-20 pb-32">

        {/* Hero */}
        <div className="pt-10 pb-14 border-b border-neutral-200">
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-5">Privacy</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-none mb-8">
            Privacy Policy
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <p className="text-neutral-500 text-[15px] max-w-xl leading-relaxed">
              This Policy explains how Elephant Invest collects, uses, and protects personal data submitted through this platform.
            </p>
            <p className="text-[11px] text-neutral-400 tracking-[0.15em] uppercase shrink-0">
              Effective: March 2026
            </p>
          </div>
        </div>

        {/* Table of contents */}
        <div className="py-14 border-b border-neutral-200">
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-8">Contents</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-0">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="flex items-baseline gap-4 group py-3 border-b border-neutral-100 hover:border-neutral-300 transition-colors"
              >
                <span className="text-[11px] text-neutral-300 tabular-nums shrink-0">{s.id}</span>
                <span className="text-[14px] text-neutral-500 group-hover:text-neutral-900 transition-colors">
                  {s.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Privacy sections */}
        <div>
          {sections.map((s) => (
            <div
              key={s.id}
              id={`section-${s.id}`}
              className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-20 py-14 border-b border-neutral-100"
            >
              {/* Label column */}
              <div className="mb-5 md:mb-0">
                <span className="text-[11px] text-neutral-300 tracking-[0.15em] uppercase tabular-nums block mb-1">
                  {s.id}
                </span>
                <span className="text-[12px] text-neutral-400 tracking-[0.1em] uppercase leading-snug block">
                  {s.title}
                </span>
              </div>
              {/* Text column */}
              <div className="space-y-5">
                {s.content.map((para, j) => (
                  <p key={j} className="text-neutral-600 text-[15px] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cross-link to Terms */}
        <div className="mt-14 border border-neutral-200 bg-neutral-50 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-2">Also see</p>
            <p className="text-neutral-600 text-[15px] leading-relaxed max-w-xl">
              For platform usage rules, access restrictions, and intellectual property terms, see our Terms of Use.
            </p>
          </div>
          <Link
            href="/terms"
            className="shrink-0 text-[13px] font-medium text-neutral-900 border-b border-neutral-900 hover:opacity-50 transition-opacity whitespace-nowrap"
          >
            View Terms →
          </Link>
        </div>
      </div>

      {/* =====================================================================
          FOOTER
      ===================================================================== */}
      <footer className="border-t border-neutral-100 px-6 sm:px-10 lg:px-20 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-[12px] text-neutral-400">© 2026 Elephant Invest</p>
        <nav className="flex flex-wrap gap-6">
          {[
            { label: "Portfolio",           href: "/portfolio" },
            { label: "Apply for allocation",href: "/apply" },
            { label: "Terms",               href: "/terms" },
            { label: "Legal",               href: "/legal" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}
