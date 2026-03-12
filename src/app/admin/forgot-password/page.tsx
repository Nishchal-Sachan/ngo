"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-100" />

      <div className="relative z-10 w-full max-w-md bg-card rounded-md border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-md bg-slate-100 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-serif font-semibold text-primary mb-2">Forgot Password?</h1>
        <p className="text-muted text-sm mb-6">
          Contact your administrator to reset your password. Reach out at{" "}
          <a
            href="mailto:admin@klsws.org"
            className="text-primary hover:text-primary-dark font-medium"
          >
            admin@klsws.org
          </a>
        </p>
        <Link
          href="/admin/login"
          className="inline-block px-6 py-2.5 bg-slate-100 text-muted rounded-md font-medium hover:bg-slate-200 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </section>
  );
}
