"use client";

import React, { useEffect, useRef, useState } from "react";

export default function TallyForm() {
  const formRef = useRef<HTMLDivElement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const TALLY_EMBED_SRC =
    "https://tally.so/embed/GxrDEO?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
  const TALLY_WIDGET_SRC = "https://tally.so/widgets/embed.js";

  // Load Tally embed script once the form is shown (or if already loaded, trigger loadEmbeds)
  useEffect(() => {
    if (!showForm) return;

    const d = document;
    const w = TALLY_WIDGET_SRC;

    const v = () => {
      if (typeof window !== "undefined" && typeof (window as any).Tally !== "undefined") {
        (window as any).Tally.loadEmbeds();
      } else {
        d.querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])").forEach((e) => {
          e.src = e.dataset.tallySrc || "";
        });
      }
    };

    // If script already present, just run v()
    if (d.querySelector(`script[src="${w}"]`)) {
      v();
      return;
    }

    const s = d.createElement("script");
    s.src = w;
    s.async = true;
    s.onload = v;
    s.onerror = v;
    d.body.appendChild(s);

    return () => {
      // do not remove script (keeps it cached across navigation)
    };
  }, [showForm]);

  const openFormInline = () => {
    setShowForm(true);
    // wait for render then scroll
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <button
          type="button"
          onClick={openFormInline}
          className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-white hover:bg-neutral-800 transition text-[15px] sm:text-[16px] font-medium"
        >
          Apply for allocation →
        </button>

        <div className="text-[13px] sm:text-[14px] text-neutral-500 leading-[1.8] max-w-xl">
          Past performance is not indicative of future results. Investments may lose value. This is not a public
          solicitation.
        </div>
      </div>

      {/* ===============================
          TALLY INLINE EMBED (Hidden until click)
      =============================== */}
      {showForm ? (
        <div ref={formRef} className="mt-16 sm:mt-20">
          <div className="rounded-[26px] bg-white/60 ring-1 ring-black/10 overflow-hidden">
            <div className="p-6 sm:p-7">
              <div className="text-[12px] tracking-[0.22em] text-black/55">APPLICATION</div>
              <div className="mt-4">
                <iframe
                  data-tally-src={TALLY_EMBED_SRC}
                  loading="lazy"
                  width="100%"
                  height={4133}
                  frameBorder={0}
                  marginHeight={0}
                  marginWidth={0}
                  title="Elephant Invest — Allocation Application"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

