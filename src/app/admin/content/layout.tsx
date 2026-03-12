"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_ITEMS = [
  { href: "/admin/content/hero", label: "Hero Section" },
  { href: "/admin/content/about", label: "About Section" },
  { href: "/admin/content/legal", label: "Legal Information" },
  { href: "/admin/content/board", label: "Board Members" },
  { href: "/admin/content/bank", label: "Bank Details" },
] as const;

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="w-56 flex-shrink-0 border-r border-slate-200 bg-white">
          <div className="sticky top-0 py-6">
            <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Content Management
            </h2>
            <nav className="mt-4 space-y-0.5 px-2">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0 py-8 px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
