"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, siteConfig } from "@/data/mock";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["home", "about", "work", "campaigns", "reports", "volunteer", "donate"];

function Logo() {
  return (
    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-[#0F3D73] flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
      </svg>
    </div>
  );
}

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 120;
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const publicItems = navItems.filter((item) => item.id !== "admin");
  const adminItem = navItems.find((item) => item.id === "admin");

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Logo />
          <div className="flex flex-col">
            <span className="font-serif font-semibold text-[#1B1F23] text-sm leading-tight">
              Kanhaiya Lal Shakya
            </span>
            <span className="font-serif font-semibold text-[#1B1F23] text-sm leading-tight">
              Social Welfare Society
            </span>
            <span className="text-xs text-[#6B7280] font-normal mt-0.5">
              Registered Non-Profit Organization
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 flex-shrink-0">
          {publicItems.map((item) => {
            const href = item.id === "home" ? "/" : `/#${item.id}`;
            const isActive = activeSection === item.id;
            const isDonate = item.id === "donate";
            const label = item.id === "join" ? "Volunteer" : item.label;

            if (isDonate) {
              return (
                <a
                  key={item.id}
                  href={href}
                  className="px-4 py-2 bg-[#0F3D73] text-white text-sm font-medium rounded-md hover:bg-[#0B2E59] transition-colors"
                >
                  {label}
                </a>
              );
            }

            return (
              <a
                key={item.id}
                href={href}
                className={cn(
                  "relative py-2 text-sm font-medium text-[#374151] hover:text-[#0F3D73] transition-colors",
                  isActive && "text-[#0F3D73]"
                )}
              >
                {label}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F3D73] transition-opacity",
                    isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
                  )}
                />
              </a>
            );
          })}
          {adminItem && (
            <Link
              href={adminItem.href}
              className="relative py-2 text-sm font-medium text-[#6B7280] hover:text-[#0F3D73] transition-colors"
            >
              {adminItem.label}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F3D73] opacity-0 hover:opacity-100 transition-opacity" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
