// components/CompanyTheyKeepSection.tsx
"use client";

import React from "react";

type Card = {
  id: string;
  label: string;
  fileBase: string; // no extension (we prefer .webm with .mp4 fallback)
};

const CARDS: Card[] = [
  { id: "palantir", label: "PALANTIR", fileBase: "palantir" },
  { id: "unh", label: "UNITED HEALTHCARE", fileBase: "unh" },
  { id: "ionq", label: "IONQ", fileBase: "ionq" },
];

function VideoCard({ card }: { card: Card }) {
  const webmSrc = encodeURI(`/video/${card.fileBase}.webm`);
  const mp4Src = encodeURI(`/video/${card.fileBase}.mp4`);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="relative aspect-[4/5] w-full bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="metadata"
          {...{ "webkit-playsinline": "true" } as any}
        >
          <source src={mp4Src} type="video/mp4" />
          <source src={webmSrc} type="video/webm" />
        </video>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-24 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
      <div className="absolute bottom-4 left-5 text-[11px] tracking-[0.22em] text-white/80">
        {card.label}
      </div>
    </div>
  );
}

export default function CompanyTheyKeepSection() {
  const leftColumn = CARDS.filter((_, i) => i % 2 === 0);
  const rightColumn = CARDS.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative bg-[#fbfaf7]">
      <div className="mx-auto max-w-[1200px] px-6 pt-20 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: sticky text */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2 className="max-w-[18ch] text-[36px] leading-[1.02] tracking-[-0.015em] text-black/85 lg:text-[38px]">
                We believe great companies are made greater by the company they keep.
              </h2>

              <div className="mt-8">
                <button className="group inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-7 py-4 text-[14px] text-black/80 shadow-[0_1px_0_rgba(0,0,0,0.02)] hover:border-black/25">
                  <span>Explore Portfolio</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-black/15 transition-transform group-hover:translate-x-[2px]">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: videos scroll normally */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:gap-9">
              <div className="flex flex-col gap-9">
                {leftColumn.map((c) => (
                  <VideoCard key={c.id} card={c} />
                ))}
              </div>

              <div className="flex flex-col gap-9 sm:pt-10">
                {rightColumn.map((c) => (
                  <VideoCard key={c.id} card={c} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden className="h-24 lg:h-32" />
      </div>
    </section>
  );
}