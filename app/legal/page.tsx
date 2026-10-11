"use client";

// app/legal/page.tsx
// Elephant Invest — Legal / Terms of Use
// Header is identical to the Portfolio page (white bg, same nav, same hamburger + fullscreen overlay)

import Link from "next/link";
import React from "react";
import { SiteHeader } from "../components/SiteHeader";

// ─── legal sections ───────────────────────────────────────────────────────────
const sections = [
  {
    id: "01",
    title: "Nature of the Vehicle",
    content: [
      "Elephant Invest is a private investment vehicle operated for the benefit of its members. It is not a registered investment adviser, broker-dealer, or fund under any applicable securities law. Participation is strictly limited to eligible individuals and entities who meet the criteria set forth at the time of onboarding.",
      "Nothing on this platform constitutes an offer to sell or a solicitation to buy any security. All investment decisions are made at the sole discretion of Elephant Invest's principals and communicated to participants through appropriate channels.",
    ],
  },
  {
    id: "02",
    title: "Eligibility & Access",
    content: [
      "Access to this platform and its contents is restricted to individuals who have been expressly granted access by Elephant Invest. You represent and warrant that you are accessing this platform lawfully and in compliance with the regulations applicable in your jurisdiction.",
      "If you are accessing this platform on behalf of a legal entity, you represent that you have the authority to bind such entity to these Terms. Unauthorized access, reproduction, or redistribution of any content is strictly prohibited.",
    ],
  },
  {
    id: "03",
    title: "No Investment Advice",
    content: [
      "All information provided on this platform — including but not limited to performance data, portfolio holdings, market commentary, and strategic outlooks — is provided for informational purposes only and does not constitute investment advice, legal counsel, or financial guidance of any kind.",
      "Past performance is not indicative of future results. Investing involves risk, including the possible loss of principal. You should conduct your own due diligence and consult qualified advisers before making any investment decision.",
    ],
  },
  {
    id: "04",
    title: "Performance Data",
    content: [
      "Performance figures presented on this platform are internal estimates and reflect marked-to-market valuations and realized results as reported by Elephant Invest's principals. These figures are net of internal operational costs unless otherwise stated.",
      "Performance data has not been independently audited or verified. Marked returns may differ from realized returns. Elephant Invest reserves the right to revise reported figures as additional information becomes available.",
    ],
  },
  {
    id: "05",
    title: "Confidentiality",
    content: [
      "All information shared through this platform — including portfolio composition, strategy, returns, and communications — is strictly confidential. You agree not to disclose, reproduce, or share any such information with third parties without prior written consent from Elephant Invest.",
      "This obligation of confidentiality survives termination of your access to the platform and continues indefinitely unless expressly released in writing by Elephant Invest.",
    ],
  },
  {
    id: "06",
    title: "Intellectual Property",
    content: [
      "All content on this platform, including text, data, graphics, logos, and proprietary research, is the intellectual property of Elephant Invest or its licensors. No content may be copied, modified, distributed, or used for commercial purposes without explicit written permission.",
      "The Elephant Invest name, mark, and visual identity are proprietary. Any unauthorized use constitutes a violation of these Terms and applicable intellectual property law.",
    ],
  },
  {
    id: "07",
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, Elephant Invest, its principals, employees, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this platform or any investment made through or influenced by information contained herein.",
      "Elephant Invest makes no representation or warranty, express or implied, as to the accuracy, completeness, or fitness for a particular purpose of any information on this platform.",
    ],
  },
  {
    id: "08",
    title: "Governing Law",
    content: [
      "These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Elephant Invest is established, without regard to its conflict of law provisions.",
      "Any disputes arising under or in connection with these Terms shall be resolved through binding arbitration or the courts of competent jurisdiction, as determined by Elephant Invest at its sole discretion.",
    ],
  },
  {
    id: "09",
    title: "Amendments",
    content: [
      "Elephant Invest reserves the right to amend these Terms at any time without prior notice. Continued access to this platform following any amendment constitutes acceptance of the revised Terms.",
      "We encourage you to review these Terms periodically. Material changes will be communicated to active participants through appropriate channels.",
    ],
  },
  {
    id: "10",
    title: "Contact",
    content: [
      "If you have questions regarding these Terms or your participation in Elephant Invest, please contact us through the application portal or reach out to your designated point of contact within the vehicle.",
    ],
  },
];

// ─── page ─────────────────────────────────────────────────────────────────────
export default function LegalPage() {
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
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-5">Regulatory</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-none mb-8">
            Regulatory & Legal
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <p className="text-neutral-500 text-[15px] max-w-xl leading-relaxed">
              These terms govern your access to and use of the Elephant Invest platform.
              By accessing this site, you agree to be bound by the provisions set out below.
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

        {/* Legal sections */}
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

        {/* Regulatory notice */}
        <div className="mt-14 border border-neutral-200 bg-neutral-50 p-8 md:p-12">
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-4">
            Regulatory Notice
          </p>
          <p className="text-neutral-500 text-[13px] leading-relaxed max-w-3xl">
            Elephant Invest is a private, non-registered investment vehicle. It is not subject to the
            same regulatory requirements as registered investment funds. Interests in Elephant Invest
            have not been and will not be registered under the Securities Act of 1933 or any state
            securities law. This platform is intended solely for informational purposes and does not
            constitute an offer to sell or a solicitation to buy any security in any jurisdiction where
            such an offer or solicitation is not authorized or to any person to whom it is unlawful to
            make such an offer or solicitation.
          </p>
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