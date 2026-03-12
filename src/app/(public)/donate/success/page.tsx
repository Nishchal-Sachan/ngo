"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const receipt = searchParams.get("receipt");
  const amount = searchParams.get("amount");
  const name = searchParams.get("name");

  if (!receipt) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Invalid Receipt</h2>
        <p className="text-muted mb-6 leading-relaxed">
          We couldn&apos;t find your donation details. Please contact us if you need
          assistance.
        </p>
        <Link
          href="/#donate"
          className="inline-block px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
        >
          Back to Donate
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <svg
          className="w-10 h-10 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-serif font-semibold text-primary mb-4">Thank You!</h2>
      <p className="text-muted mb-6 leading-relaxed">
        Your donation has been received successfully.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-md p-6 mb-8 text-left max-w-md mx-auto">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted">Receipt Number</span>
            <span className="font-semibold text-primary">{receipt}</span>
          </div>
          {amount && (
            <div className="flex justify-between">
              <span className="text-muted">Amount</span>
              <span className="font-semibold text-primary">
                ₹{Number(amount).toLocaleString("en-IN")}
              </span>
            </div>
          )}
          {name && (
            <div className="flex justify-between">
              <span className="text-muted">Donor</span>
              <span className="font-semibold text-primary">{name}</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        Please save your receipt number for your records. A confirmation may be
        sent to your registered contact.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/#donate"
          className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
        >
          Donate Again
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

export default function DonateSuccessPage() {
  return (
    <section
      id="donate-success"
      className="py-20 px-4 bg-background min-h-screen flex flex-col items-center justify-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-lg mx-auto bg-card rounded-md border border-slate-200 p-8">
          <Suspense fallback={<p className="text-muted">Loading...</p>}>
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
