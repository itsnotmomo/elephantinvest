"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function XIcon({ size = 16 }: { size?: number }) {
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

export function InvestorGateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const navigatingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      navigatingRef.current = false;
      setLoading(false);
    }
  }, [isOpen, router]);

  if (!isOpen) return null;

  const go = (href: "/" | "/apply") => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setLoading(true);
    if (href === "/apply") {
      // Hard navigation — /apply is a static page, CDN-served HTML is faster than client-side routing on mobile
      window.location.href = "/apply";
    } else {
      router.push(href);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true" aria-label="Investor Classification">
      <div
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="relative h-full w-full flex items-center justify-center px-4 sm:px-6">
        <div
          className="relative w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#111] p-6 sm:p-10 text-white shadow-2xl"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-4 top-4 h-8 w-8 inline-flex items-center justify-center rounded-md text-neutral-500 hover:text-white transition"
          >
            <XIcon size={16} />
          </button>

          <div className="text-[24px] font-semibold text-white">Investor Classification</div>
          <div className="mt-2 text-[14px] text-neutral-400">
            Before proceeding, please confirm your investor status.
          </div>

          <div className="mt-6 flex flex-col gap-[10px]">
            <button
              type="button"
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                go("/apply");
              }}
              className="relative w-full text-left p-4 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:border-white/10"
            >
              <div className={loading ? "opacity-0" : "opacity-100"}>
                <div className="text-[16px] font-medium text-white">Sophisticated Investor</div>
                <div className="mt-1 text-[13px] text-neutral-500">
                  Sufficient experience and knowledge to understand private investment risks.
                </div>
              </div>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[16px] font-medium text-white">Redirecting…</div>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                go("/");
              }}
              className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition"
            >
              <div className="text-[16px] font-medium text-white">None of the above</div>
              <div className="mt-1 text-[13px] text-neutral-500">I do not fall into either category.</div>
            </button>
          </div>

          <div className="mt-5 text-[11px] text-neutral-600 text-center">
            This classification is for access purposes only and does not constitute legal or financial advice.
          </div>
        </div>
      </div>
    </div>
  );
}

