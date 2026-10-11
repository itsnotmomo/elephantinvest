"use client";

// app/terms/page.tsx
// Elephant Invest — Terms of Use (platform usage, access, IP, accounts)

import Link from "next/link";
import React from "react";
import { SiteHeader } from "../components/SiteHeader";

const sections = [
  {
    id: "01",
    title: "Acceptance of Terms",
    content: [
      "By accessing or using the Elephant Invest platform, you confirm that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree, you must immediately discontinue use of the platform.",
      "These Terms apply to all visitors, registered users, and any other individuals who access the platform in any capacity. Your continued use of the platform following any update to these Terms constitutes acceptance of the revised version.",
    ],
  },
  {
    id: "02",
    title: "Platform Access",
    content: [
      "Access to the Elephant Invest platform is granted on a limited, non-exclusive, non-transferable basis. We reserve the right to modify, suspend, or terminate access to any part of the platform at any time, with or without notice.",
      "You are responsible for maintaining the confidentiality of any access credentials provided to you. Any activity carried out under your credentials is your sole responsibility. You must notify Elephant Invest immediately if you suspect unauthorized access.",
    ],
  },
  {
    id: "03",
    title: "Permitted Use",
    content: [
      "You may use this platform solely for lawful purposes and in accordance with these Terms. You agree not to use the platform in any way that could damage, disable, overburden, or impair its functionality, or interfere with any other party's use.",
      "You must not attempt to gain unauthorized access to any part of the platform, its servers, or any systems connected to it. You must not use automated scripts, bots, or scraping tools to extract data or content from the platform.",
    ],
  },
  {
    id: "04",
    title: "Prohibited Conduct",
    content: [
      "The following conduct is strictly prohibited: impersonating any person or entity; transmitting any content that is unlawful, defamatory, or fraudulent; using the platform to solicit investment from third parties without authorization; sharing access credentials with unauthorized individuals.",
      "Elephant Invest reserves the right to immediately suspend or revoke platform access for any user found to be in violation of these prohibitions, without liability to that user.",
    ],
  },
  {
    id: "05",
    title: "Intellectual Property",
    content: [
      "All content on this platform — including text, graphics, data, logos, research, analysis, and software — is the exclusive intellectual property of Elephant Invest or its licensors, protected by applicable copyright, trademark, and other intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit any content from this platform without prior written authorization from Elephant Invest.",
    ],
  },
  {
    id: "06",
    title: "User Submissions",
    content: [
      "Any information, documents, or materials you submit through this platform — including application materials, communications, and responses to information requests — are provided voluntarily. By submitting such materials, you grant Elephant Invest the right to use them for the purposes for which they were submitted.",
      "You represent that any information you provide is accurate and complete. Providing false or misleading information may result in immediate termination of access and potential legal consequences.",
    ],
  },
  {
    id: "07",
    title: "Links & Third-Party Content",
    content: [
      "The platform may contain links to third-party websites or resources. These links are provided for convenience only. Elephant Invest does not endorse and is not responsible for the content, accuracy, or practices of any third-party sites.",
      "Accessing third-party links from this platform is at your own risk. These Terms do not apply to external sites, and you should review their respective terms and privacy policies before engaging with them.",
    ],
  },
  {
    id: "08",
    title: "Termination of Access",
    content: [
      "Elephant Invest may terminate or suspend your access to the platform at any time, without notice, for conduct that it determines — in its sole discretion — violates these Terms or is harmful to other users, Elephant Invest, or third parties.",
      "Upon termination, all rights granted to you under these Terms will immediately cease. Provisions that by their nature should survive termination — including intellectual property rights, confidentiality obligations, and disclaimers — will continue to apply.",
    ],
  },
  {
    id: "09",
    title: "Modifications to the Platform",
    content: [
      "Elephant Invest reserves the right to modify, suspend, or discontinue any feature or aspect of the platform at any time without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the platform.",
    ],
  },
  {
    id: "10",
    title: "Amendments to These Terms",
    content: [
      "We may update these Terms at any time. When we do, the revised Terms will be posted on this page with an updated effective date. Your continued use of the platform after any change constitutes your acceptance of the new Terms.",
      "We encourage you to review this page periodically. If you do not agree to the updated Terms, you must stop using the platform.",
    ],
  },
  {
    id: "11",
    title: "Contact",
    content: [
      "Questions about these Terms should be directed through the application portal or to your designated contact within Elephant Invest. We aim to respond to all formal enquiries within a reasonable timeframe.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* HEADER */}
      <section className="px-6 sm:px-10 lg:px-20 pt-6 sm:pt-8">
        <SiteHeader />
      </section>

      {/* CONTENT */}
      <div className="px-6 sm:px-10 lg:px-20 pt-20 pb-32">

        {/* Hero */}
        <div className="pt-10 pb-14 border-b border-neutral-200">
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-5">Platform</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-none mb-8">
            Terms of Use
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <p className="text-neutral-500 text-[15px] max-w-xl leading-relaxed">
              These Terms govern how you access and use the Elephant Invest platform.
              Please read them carefully before proceeding.
            </p>
            <p className="text-[11px] text-neutral-400 tracking-[0.15em] uppercase shrink-0">
              Effective: March 2026
            </p>
          </div>
        </div>

        {/* Table of contents */}
        <div className="py-14 border-b border-neutral-200">
          <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-8">Contents</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20">
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

        {/* Sections */}
        <div>
          {sections.map((s) => (
            <div
              key={s.id}
              id={`section-${s.id}`}
              className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-20 py-14 border-b border-neutral-100"
            >
              <div className="mb-5 md:mb-0">
                <span className="text-[11px] text-neutral-300 tracking-[0.15em] uppercase tabular-nums block mb-1">{s.id}</span>
                <span className="text-[12px] text-neutral-400 tracking-[0.1em] uppercase leading-snug block">{s.title}</span>
              </div>
              <div className="space-y-5">
                {s.content.map((para, j) => (
                  <p key={j} className="text-neutral-600 text-[15px] leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cross-link to Legal */}
        <div className="mt-14 border border-neutral-200 bg-neutral-50 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-2">Also see</p>
            <p className="text-neutral-600 text-[15px] leading-relaxed max-w-xl">
              For regulatory disclosures, investment disclaimers, securities law notices, and liability
              limitations applicable to Elephant Invest as a private investment vehicle, see our Legal page.
            </p>
          </div>
          <Link
            href="/legal"
            className="shrink-0 text-[13px] font-medium text-neutral-900 border-b border-neutral-900 hover:opacity-50 transition-opacity whitespace-nowrap"
          >
            View Legal →
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-100 px-6 sm:px-10 lg:px-20 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-[12px] text-neutral-400">© 2026 Elephant Invest</p>
        <nav className="flex flex-wrap gap-6">
          {[
            { label: "Portfolio",            href: "/portfolio" },
            { label: "Apply for allocation", href: "/apply" },
            { label: "Terms",                href: "/terms" },
            { label: "Legal",                href: "/legal" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-[12px] text-neutral-400 hover:text-neutral-900 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>

    </main>
  );
}