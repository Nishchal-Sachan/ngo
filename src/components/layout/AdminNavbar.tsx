"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/mock";

export function AdminNavbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/forgot-password";

  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center">
          <Link
            href="/"
            className="font-bold text-lg text-primary hover:text-primary-dark transition-colors"
          >
            {siteConfig.organizationName}
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg text-primary hover:text-primary-dark transition-colors"
        >
          {siteConfig.organizationName}
        </Link>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/admin/dashboard"
                ? "bg-slate-100 text-primary"
                : "text-muted hover:text-primary hover:bg-slate-50"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/campaigns"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/campaigns")
                ? "bg-slate-100 text-primary"
                : "text-muted hover:text-primary hover:bg-slate-50"
            }`}
          >
            Campaigns
          </Link>
          <Link
            href="/admin/reports"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/reports")
                ? "bg-slate-100 text-primary"
                : "text-muted hover:text-primary hover:bg-slate-50"
            }`}
          >
            Reports
          </Link>
          <Link
            href="/admin/content"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/content")
                ? "bg-slate-100 text-primary"
                : "text-muted hover:text-primary hover:bg-slate-50"
            }`}
          >
            Content
          </Link>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
            window.location.href = "/admin/login";
          }}
        >
          <button
            type="submit"
            className="px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
