"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-black/40 px-6 py-4">
        <span className="text-[14px] text-neutral-900">✓ You're now signed up</span>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="inline-flex items-center rounded-full border border-black/40 overflow-hidden bg-transparent">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-[200px] sm:w-[320px] lg:w-[360px] bg-transparent px-6 py-4 text-[14px] text-neutral-900 placeholder:text-neutral-900/45 outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="px-7 sm:px-10 py-4 text-[14px] font-medium text-neutral-900 hover:bg-black/5 transition disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-[13px] text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}

export default function FeatureWithNewsletter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const newsletterContentRef = useRef<HTMLDivElement | null>(null);

  const [newsletterH, setNewsletterH] = useState(360);
  const [revealPx, setRevealPx] = useState(0);

  useEffect(() => {
    const el = newsletterContentRef.current;
    if (!el) return;
    const measure = () => setNewsletterH(Math.ceil(el.scrollHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const total = Math.max(1, newsletterH);
      const within = clamp(window.scrollY - sectionTop, 0, total);
      setRevealPx(within);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [newsletterH]);

  const videoHeightStyle = { height: `calc(100vh - ${revealPx}px)` };
  const newsletterHeightStyle = { height: `${revealPx}px` };
  const revealProgress = newsletterH ? clamp(revealPx / newsletterH, 0, 1) : 0;
  const copyTranslateY = -clamp(revealProgress * 80, 0, 48);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0d0e]"
      style={{ height: `calc(100vh + ${newsletterH}px)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* VIDEO AREA */}
        <div className="relative w-full overflow-hidden" style={videoHeightStyle}>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            preload="metadata"
            {...{ "webkit-playsinline": "true" } as any}
          >
            <source src="/video/feature.mp4" type="video/mp4" />
            <source src="/video/feature.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_45%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          <div className="relative z-10 h-full flex items-center">
            <div
              className="w-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-16"
              style={{ transform: `translateY(${copyTranslateY}px)`, willChange: "transform" }}
            >
              {/* MOBILE */}
              <div className="md:hidden text-center">
                <div className="text-[11px] tracking-[0.28em] text-white/55 mb-5">INTELLIGENT SYSTEMS</div>
                <h2 className="text-white font-medium tracking-tight leading-[1.04] text-[38px]">
                  AI as an edge<br />in real markets.
                </h2>
                <p className="mt-5 mx-auto max-w-[320px] text-white/65 text-[13px] leading-[1.7]">
                  We invest in applied intelligence — infrastructure, data, and decision systems that turn complexity into execution.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link href="/insights/ai" className="group inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-white/90 backdrop-blur-md hover:bg-white/16 transition">
                    <span className="text-[13px]">Read more</span>
                    <span className="h-9 w-9 rounded-full border border-white/20 bg-white/10 grid place-items-center group-hover:bg-white/16 transition text-sm">→</span>
                  </Link>
                </div>
              </div>

              {/* DESKTOP */}
              <div className="hidden md:grid grid-cols-12 gap-8 items-center">
                <div className="col-span-6 lg:col-span-5">
                  <div className="text-[11px] tracking-[0.28em] text-white/60">INTELLIGENT SYSTEMS</div>
                  <h2 className="mt-5 text-white font-medium tracking-tight leading-[1.02] text-[56px] lg:text-[68px]">
                    AI as an edge<br />in real markets.
                  </h2>
                  <p className="mt-5 max-w-md text-white/70 text-[14px] leading-[1.65]">
                    We invest in applied intelligence — infrastructure, data, and decision systems that turn complexity into execution. Built for outcomes that compound over years, not quarters.
                  </p>
                  <div className="mt-8">
                    <Link href="/insights/ai" className="group inline-flex items-center gap-5 rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-white/90 backdrop-blur-md hover:bg-white/14 transition">
                      <span className="text-[14px]">Read more</span>
                      <span className="h-10 w-10 rounded-full border border-white/18 bg-white/10 grid place-items-center group-hover:bg-white/14 transition">→</span>
                    </Link>
                  </div>
                </div>

                <div className="col-span-6 lg:col-span-7 justify-self-end w-full flex justify-end">
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block">
                      <svg width="74" height="74" viewBox="0 0 120 120" fill="none" aria-hidden="true" className="opacity-90">
                        <path d="M34 70c14-6 18-26 32-32 14-6 24 4 20 18-4 14-26 26-40 28-14 2-18-8-12-14z"
                          stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                      </svg>
                    </div>
                    <div className="max-w-[520px] lg:max-w-[720px]">
                      <div className="text-white/95 font-medium tracking-tight leading-[1.02] text-[56px] lg:text-[72px] text-right">
                        Intelligent systems<br className="hidden lg:block" />{" "}that compound.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-6 sm:right-10 lg:right-16 bottom-8 z-10 hidden md:flex flex-col items-center gap-4">
            <div className="writing-mode-vertical text-[11px] tracking-[0.28em] text-white/60">FEATURE</div>
            <div className="h-20 w-px bg-white/20" />
            <div className="text-white/65 text-xl leading-none">↓</div>
          </div>
          <style jsx>{`
            .writing-mode-vertical { writing-mode: vertical-rl; text-orientation: mixed; }
          `}</style>
        </div>

        {/* NEWSLETTER AREA */}
        <div className="relative w-full overflow-hidden" style={newsletterHeightStyle} aria-hidden={revealPx < 4}>
          <div className="absolute inset-0 bg-[#e9c2a3]" />
          <div
            className="relative"
            style={{
              opacity: revealProgress,
              transform: `translateY(${(1 - revealProgress) * 16}px)`,
              transition: "opacity 180ms linear, transform 220ms ease-out",
            }}
          >
            <div ref={newsletterContentRef} className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-14 sm:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                <div className="lg:col-span-8">
                  <h3 className="text-[40px] sm:text-[52px] lg:text-[72px] leading-[1.02] tracking-tight text-neutral-900">
                    Sign up for our monthly<br />newsletter
                  </h3>
                  <p className="mt-8 text-[14px] sm:text-[16px] text-neutral-900/70">
                    Stay up to date with the latest data and insights
                  </p>
                  <NewsletterForm />
                </div>

                <div className="lg:col-span-4 hidden lg:flex justify-end">
                  <div className="flex flex-col items-center gap-4 pt-2">
                    <div className="writing-mode-vertical text-[11px] tracking-[0.28em] text-neutral-900/55">FEATURE</div>
                    <div className="h-24 w-px bg-black/25" />
                    <div className="text-neutral-900/60 text-xl leading-none">↓</div>
                  </div>
                </div>
              </div>
              <style jsx>{`
                .writing-mode-vertical { writing-mode: vertical-rl; text-orientation: mixed; }
              `}</style>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}