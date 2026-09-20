"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] text-[var(--ink)] p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-[var(--arc-red)]">404</h1>
        <p className="mb-4 text-xl text-[var(--muted)]">Oops! Page not found</p>
        <Link href="/" className="text-[var(--secondary)] underline hover:opacity-80">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
