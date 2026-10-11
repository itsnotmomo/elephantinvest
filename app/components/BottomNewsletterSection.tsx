"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

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
      <div className="mt-6 max-w-xl">
        <div className="flex items-center rounded-full border border-white/40 px-8 py-5">
          <span className="text-[16px] text-white">✓ You're now signed up</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-xl">
      <div className="flex items-center rounded-full border border-white/40 overflow-hidden">
        <input
          className="w-full bg-transparent px-8 py-5 text-[16px] text-white placeholder:text-white/55 outline-none"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="shrink-0 m-1 rounded-full border border-white/40 px-10 py-4 text-white text-[18px] hover:bg-white/10 transition disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-[13px] text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}

export default function BottomNewsletterSection() {
  const elephantRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: elephantRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [18, 0, 0, -18]);

  return (
    <>
      {/* ===================== NEWSLETTER ===================== */}
      <section className="bg-[#3e3a36] relative z-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <h3 className="text-white text-[44px] sm:text-[56px] leading-[1.02] tracking-tight">
                Sign up for our monthly
                <br />
                newsletter
              </h3>

              <p className="mt-12 text-white/80 text-[18px]">
                Stay up to date with the latest data and insights
              </p>

              <NewsletterForm />

              <div className="mt-16 text-white/40 text-[12px]">
                © {new Date().getFullYear()} Elephant Invest
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-5 text-white/90 text-[20px] leading-[1.3]">
                <Link href="/portfolio" className="hover:text-white transition">Portfolio</Link>
                <Link href="/apply" className="hover:text-white transition">Apply for allocation</Link>
                <Link href="/terms" className="hover:text-white transition">Terms</Link>
                <Link href="/legal" className="hover:text-white transition">Legal</Link>
              </div>

              <div className="mt-14 text-white/45 text-[13px] flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/terms" className="hover:text-white/80 transition">Terms</Link>
                <span>|</span>
                <Link href="/privacy" className="hover:text-white/80 transition">Privacy</Link>
                <span>|</span>
                <Link href="/legal" className="hover:text-white/80 transition">Regulatory</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ELEPHANT INVEST ===================== */}
      <section ref={elephantRef} className="relative">
        <div className="h-[22vh] sm:h-[42vh] lg:h-[40vh] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(168,216,238,0.95), rgba(255,210,160,0.95))",
            }}
          />

          <motion.div style={{ opacity, y }} className="relative h-full">
            <div className="h-full flex items-end">
              <div className="w-full pb-[1.5vw]">
                <div
                  className="text-white font-medium tracking-tight leading-none whitespace-nowrap"
                  style={{ fontSize: "clamp(28px, 13.5vw, 140px)" }}
                >
                  &nbsp;Elephant Invest
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}