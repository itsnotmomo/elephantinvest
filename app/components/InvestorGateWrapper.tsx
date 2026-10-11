"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "./SiteHeader";
import { InvestorGateModal } from "./InvestorGateModal";

export function InvestorGateWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const [investorGateOpen, setInvestorGateOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = investorGateOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [investorGateOpen]);

  useEffect(() => {
    const handler = () => setInvestorGateOpen(true);
    window.addEventListener("open-investor-gate", handler);
    return () => window.removeEventListener("open-investor-gate", handler);
  }, []);

  const openInvestorGate = () => setInvestorGateOpen(true);

  return (
    <>
      <section className={className}>
        <SiteHeader onApplyClick={openInvestorGate} />
        {children}
      </section>

      <InvestorGateModal isOpen={investorGateOpen} onClose={() => setInvestorGateOpen(false)} />
    </>
  );
}

