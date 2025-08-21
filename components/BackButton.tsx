"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

interface BackButtonProps {
  variant?: "icon" | "label";
  className?: string;
  href?: string; // default destination
}

export default function BackButton({
  variant = "icon",
  className = "",
  href = "/dashboard/progress",
}: BackButtonProps) {
  const router = useRouter();

  const base =
    "group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation select-none";
  const styles =
    variant === "icon"
      ? "p-3 rounded-md bg-black/60 border border-white/20 hover:bg-black/80 active:bg-black/90 backdrop-blur-sm"
      : "pl-3 pr-4 py-2 rounded-xl bg-black/55 hover:bg-black/75 active:bg-black/85 border border-white/15 hover:border-white/30 inline-flex items-center gap-2 text-sm sm:text-base font-medium backdrop-blur-md";

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      type="button"
      aria-label="Back to progress"
      onClick={handleClick}
      onTouchEnd={handleClick}
      className={`${base} ${styles} ${className}`}
    >
      <svg
        className="w-5 h-5 shrink-0 text-amber-300 group-hover:text-amber-200 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {variant === "label" && (
        <span className="hidden xs:inline text-white/85 group-hover:text-white transition-colors">
          Back to Progress
        </span>
      )}
    </button>
  );
}