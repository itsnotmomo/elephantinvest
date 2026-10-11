"use client";

import React from "react";

export function WorkWithUsButton({ variant }: { variant: "hero" | "vision" }) {
  const open = () => window.dispatchEvent(new Event("open-investor-gate"));

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={open}
        className="rounded-full bg-black px-7 sm:px-9 lg:px-10 py-4 sm:py-5 text-white hover:bg-neutral-800 transition"
      >
        Work with us →
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-4 rounded-full border border-black/15 px-7 sm:px-8 py-3.5 sm:py-4 bg-white/35 hover:bg-white/55 transition"
    >
      Work with us
      <span className="h-10 w-10 flex items-center justify-center rounded-full border border-black/15">→</span>
    </button>
  );
}

