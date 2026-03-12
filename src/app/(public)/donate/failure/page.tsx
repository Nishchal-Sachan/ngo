"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Payment could not be completed.";

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-serif font-semibold text-red-700 mb-4">Payment Failed</h2>
      <p className="text-muted mb-8 leading-relaxed">{reason}</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/#donate"
          className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="px-6 py-2.5 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function DonateFailurePage() {
  return (
    <section
      id="donate-failure"
      className="py-20 px-4 bg-background min-h-screen flex flex-col items-center justify-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-lg mx-auto bg-card rounded-md border border-slate-200 p-8">
          <Suspense fallback={<p className="text-muted">Loading...</p>}>
            <FailureContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
