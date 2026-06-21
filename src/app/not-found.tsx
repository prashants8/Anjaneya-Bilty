"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-rose-500">404</h1>
        <p className="mb-4 text-xl text-slate-400">Oops! Page not found</p>
        <Link href="/" className="text-rose-400 underline hover:text-rose-300">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
