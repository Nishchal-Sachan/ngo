"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HeroSlider } from "@/components/ui";
import { VolunteerForm, DonationForm } from "@/components/forms";
import {
  aboutContent,
  workItems,
  siteConfig,
  heroContent,
  donationConfig,
  footerConfig,
  sampleActiveCampaigns,
} from "@/data/mock";
import { getCampaigns, getReports, getHeroContent, getAboutContent, getLegalInfo, getBoardMembers, getBankDetails } from "@/services/api";
import type { CampaignItem, HeroContent, AboutContentData, LegalInfoData, BoardMemberItem, BankDetailsData } from "@/services/api";
import type { WorkItem } from "@/types";

const impactStats = [
  { value: "1200+", label: "Families Supported" },
  { value: "50+", label: "Medical Camps Conducted" },
  { value: "3000+", label: "Trees Planted" },
  { value: "800+", label: "Students Benefited" },
];

const whyVolunteer = [
  {
    title: "Make Real Impact",
    description: "See the difference your time makes in communities.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Gain Experience",
    description: "Build skills and grow while giving back.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Community Network",
    description: "Connect with like-minded people and create lasting bonds.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

function renderParagraphs(text: string, className: string) {
  if (!text?.trim()) return null;
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  if (paragraphs.length === 0) return <p className={className}>{text}</p>;
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? `${className} mt-4` : className}>
          {p.trim()}
        </p>
      ))}
    </>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function WorkIcon({ icon }: { icon?: string }) {
  const icons: Record<string, React.ReactNode> = {
    medical: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    tree: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    food: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    education: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  };
  return <>{icon ? icons[icon] ?? null : null}</>;
}

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="bg-card rounded-md border border-slate-200 overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.imageAlt ?? item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 w-12 h-12 rounded-md bg-card flex items-center justify-center text-primary border border-slate-200">
          <WorkIcon icon={item.icon} />
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-lg font-serif font-semibold text-primary mb-3">{item.title}</h2>
        <p className="text-muted text-base leading-[1.6] line-clamp-3 mb-4">
          {item.description}
        </p>
        <a
          href="#campaigns"
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-dark transition-colors"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}

function AnimatedProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;
  return (
    <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
      <div
        className="h-full bg-primary rounded animate-progress"
        style={{ "--progress-end": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

function CampaignCard({
  c,
  showDonate = true,
}: {
  c: CampaignItem & { imageUrl?: string };
  showDonate?: boolean;
}) {
  return (
    <article className="bg-card rounded-md border border-slate-200 overflow-hidden">
      <div className="aspect-video overflow-hidden">
        {c.imageUrl ? (
          <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-4xl text-slate-300">✦</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-lg font-serif font-semibold text-primary mb-2">{c.title}</h2>
        <p className="text-muted text-base leading-[1.6] line-clamp-3 mb-4">
          {c.description}
        </p>
        {"goalAmount" in c && "raisedAmount" in c && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Raised</span>
              <span className="font-semibold text-primary">
                {formatCurrency(c.raisedAmount)} / {formatCurrency(c.goalAmount)}
              </span>
            </div>
            <AnimatedProgressBar raised={c.raisedAmount} goal={c.goalAmount} />
          </div>
        )}
        {showDonate && (
          <a
            href="#donate"
                  className="block w-full text-center px-4 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Donate Now
          </a>
        )}
      </div>
    </article>
  );
}

export function HomePageContent() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [reports, setReports] = useState<{ id: string; title: string; year: number; fileUrl: string; fileName: string; fileSize: number }[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [upcomingCampaigns, setUpcomingCampaigns] = useState<CampaignItem[]>([]);
  const [pastCampaigns, setPastCampaigns] = useState<CampaignItem[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [pastLoading, setPastLoading] = useState(true);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutContentData | null>(null);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [legalInfo, setLegalInfo] = useState<LegalInfoData | null>(null);
  const [legalLoading, setLegalLoading] = useState(true);
  const [boardMembers, setBoardMembers] = useState<BoardMemberItem[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState<BankDetailsData | null>(null);
  const [bankLoading, setBankLoading] = useState(true);

  useEffect(() => {
    getHeroContent().then((res) => {
      if (res.success && res.data) setHero(res.data);
      setHeroLoading(false);
    });
  }, []);

  useEffect(() => {
    getAboutContent().then((res) => {
      if (res.success && res.data) setAboutData(res.data);
      setAboutLoading(false);
    });
  }, []);

  useEffect(() => {
    getLegalInfo().then((res) => {
      if (res.success && res.data) setLegalInfo(res.data);
      setLegalLoading(false);
    });
  }, []);

  useEffect(() => {
    getBoardMembers().then((res) => {
      if (res.success && res.data) setBoardMembers(res.data);
      setBoardLoading(false);
    });
  }, []);

  useEffect(() => {
    getBankDetails().then((res) => {
      if (res.success && res.data) setBankDetails(res.data);
      setBankLoading(false);
    });
  }, []);

  useEffect(() => {
    getCampaigns({ status: "active" }).then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCampaigns(res.data);
      } else {
        setCampaigns(sampleActiveCampaigns as CampaignItem[]);
      }
      setCampaignsLoading(false);
    });
  }, []);

  useEffect(() => {
    getCampaigns({ status: "draft" }).then((res) => {
      if (res.success && res.data) setUpcomingCampaigns(res.data);
      setUpcomingLoading(false);
    });
  }, []);

  useEffect(() => {
    getCampaigns({ status: "completed" }).then((res) => {
      if (res.success && res.data) setPastCampaigns(res.data);
      setPastLoading(false);
    });
  }, []);

  useEffect(() => {
    getReports().then((res) => {
      if (res.success && res.data) setReports(res.data);
      setReportsLoading(false);
    });
  }, []);

  const placeholderImage = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80";

  const heroTitle = hero?.title ?? heroContent.title;
  const heroSubtitle = hero?.subtitle ?? "Empowering Communities Through Sustainable Development Since 2015.";
  const heroDescription =
    hero?.description ??
    heroContent.description ??
    "We are a registered non-profit dedicated to uplifting underprivileged communities through education, healthcare, environmental initiatives, and women empowerment. Our programs create sustainable change and lasting impact.";
  const heroImageUrl =
    hero?.imageUrl ?? heroContent.heroImageUrl ?? heroContent.backgroundImageUrl;
  const ctaPrimary = hero?.ctaPrimaryText ?? "Donate";
  const ctaSecondary = hero?.ctaSecondaryText ?? "Volunteer";

  return (
    <>
      {/* Hero - Full-width background with dark overlay */}
      <section
        id="home"
        className="relative min-h-[70vh] flex flex-col justify-center py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-[#0F3D73]/75" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          {heroLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg sm:text-xl text-white/95 font-medium mb-6">
                {heroSubtitle}
              </p>
              <p className="text-base text-white/90 leading-[1.7] mb-10 max-w-2xl mx-auto">
                {heroDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#donate"
                  className="px-6 py-3 bg-white text-[#0F3D73] font-medium hover:bg-white/90 transition-colors"
                >
                  {ctaPrimary}
                </a>
                <a
                  href="#volunteer"
                  className="px-6 py-3 border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
                >
                  {ctaSecondary}
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 p-6"
              >
                <div className="text-xl font-serif font-semibold text-[#1B1F23] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#4B5563] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary mb-5 text-center">
              Making a Difference Together
            </h2>
            <p className="max-w-2xl mx-auto text-muted text-base leading-[1.7] text-center mb-10">
              Our mission is to bring positive change to communities. Explore our
              work, support our campaigns, or join us as a volunteer.
            </p>
          </div>
          <div className="max-w-4xl mx-auto mb-12">
            <HeroSlider />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#about"
              className="px-6 py-2.5 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors"
            >
              Learn More
            </a>
            <a
              href="#campaigns"
              className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
              View Campaigns
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-semibold text-[#1B1F23] mb-10 border-b border-slate-200 pb-4">
            {aboutContent.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* About Organization */}
              <div>
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-4">About the Organization</h2>
                {aboutLoading ? (
                  <div className="h-24 bg-slate-100 animate-pulse rounded" />
                ) : (
                  <div className="text-[#4B5563] text-base leading-[1.7]">
                    {renderParagraphs(
                      aboutData?.aboutText ?? aboutContent.description,
                      "text-[#4B5563] text-base leading-[1.7]"
                    )}
                  </div>
                )}
              </div>

              {/* Vision */}
              <div>
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-4">Vision Statement</h2>
                {aboutLoading ? (
                  <div className="h-16 bg-slate-100 animate-pulse rounded" />
                ) : (
                  <div className="text-[#4B5563] text-base leading-[1.7]">
                    {renderParagraphs(
                      aboutData?.visionText ?? aboutContent.vision ?? "",
                      "text-[#4B5563] text-base leading-[1.7]"
                    )}
                  </div>
                )}
              </div>

              {/* Mission */}
              <div>
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-4">Mission Statement</h2>
                {aboutLoading ? (
                  <div className="h-16 bg-slate-100 animate-pulse rounded" />
                ) : (
                  <div className="text-[#4B5563] text-base leading-[1.7]">
                    {renderParagraphs(
                      aboutData?.missionText ?? aboutContent.mission ?? "",
                      "text-[#4B5563] text-base leading-[1.7]"
                    )}
                  </div>
                )}
              </div>

              {/* Core Objectives */}
              <div>
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-4">Core Objectives</h2>
                {aboutLoading ? (
                  <div className="h-32 bg-slate-100 animate-pulse rounded" />
                ) : (
                  <ul className="list-disc list-inside space-y-2 text-[#4B5563] text-base">
                    {(aboutData?.objectives?.length
                      ? aboutData.objectives
                      : aboutContent.coreObjectives ?? []
                    ).map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Governance */}
              {(boardMembers.length > 0 || aboutContent.boardMembers?.length || aboutContent.orgStructureSummary) && (
                <div>
                  <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-4">Governance</h2>
                  {aboutContent.orgStructureSummary && (
                    <p className="text-[#4B5563] text-base leading-[1.7] mb-4">
                      {aboutContent.orgStructureSummary}
                    </p>
                  )}
                  {boardLoading ? (
                    <div className="h-24 bg-slate-100 animate-pulse rounded" />
                  ) : boardMembers.length > 0 ? (
                    <div className="border border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-[#374151] uppercase tracking-wider">
                        Board of Management
                      </div>
                      <div className="divide-y divide-slate-200">
                        {boardMembers.map((m) => (
                          <div key={m.id} className="px-4 py-3 flex justify-between gap-4 text-sm">
                            <span className="text-[#1B1F23] font-medium">{m.name}</span>
                            <span className="text-[#4B5563] flex-shrink-0">{m.designation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : aboutContent.boardMembers && aboutContent.boardMembers.length > 0 ? (
                    <div className="border border-slate-200">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-[#374151] uppercase tracking-wider">
                        Board of Management
                      </div>
                      <div className="divide-y divide-slate-200">
                        {aboutContent.boardMembers.map((m, i) => (
                          <div key={i} className="px-4 py-3 flex justify-between gap-4 text-sm">
                            <span className="text-[#1B1F23] font-medium">{m.name}</span>
                            <span className="text-[#4B5563] flex-shrink-0">{m.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Right column: Legal Info + Image */}
            <div className="space-y-8">
              {/* Legal Information */}
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-4">Legal Information</h2>
                {legalLoading ? (
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                  </div>
                ) : (
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <span className="text-[#4B5563]">Status:</span>
                      <span className="text-[#1B1F23] font-medium">
                        {legalInfo?.status ?? (aboutContent.legalInfo ? "Registered NGO" : "—")}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4B5563]">Registration No.:</span>
                      <span className="text-[#1B1F23] font-medium">
                        {legalInfo?.registrationNumber ?? aboutContent.legalInfo?.registrationNumber ?? "—"}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4B5563]">Registered under:</span>
                      <span className="text-[#1B1F23] font-medium">
                        {legalInfo?.registeredUnder ?? aboutContent.legalInfo?.registeredUnder ?? "—"}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4B5563]">80G compliant:</span>
                      <span className="text-[#1B1F23] font-medium">
                        {(legalInfo?.is80GCompliant ?? aboutContent.legalInfo?.eightyGCompliant) ? "Yes" : "No"}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#4B5563]">12A compliant:</span>
                      <span className="text-[#1B1F23] font-medium">
                        {(legalInfo?.is12ACompliant ?? aboutContent.legalInfo?.twelveACompliant) ? "Yes" : "No"}
                      </span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Image */}
              <div className="border border-slate-200 overflow-hidden">
                <img
                  src={aboutContent.imageUrl}
                  alt={aboutContent.imageAlt}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-[#4B5563]">
                  Established 2015
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-primary mb-5">
              Our Work
            </h1>
            <p className="max-w-2xl mx-auto text-muted text-base leading-[1.7]">
              We are committed to making a difference through our various initiatives.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workItems.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-primary mb-5">
              Active Campaigns
            </h1>
            <p className="text-muted text-base max-w-2xl mx-auto leading-[1.7]">
              Support our ongoing initiatives. Every contribution brings us closer to our goals.
            </p>
          </div>
          {campaignsLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {campaigns.map((c) => (
                  <CampaignCard key={c.id} c={c} showDonate />
                ))}
              </div>
              {campaigns.length <= 1 && (
                <div className="mb-16 p-6 bg-card rounded-md border border-slate-200">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-lg font-serif font-semibold text-primary mb-1">More Campaigns Coming Soon</h3>
                      <p className="text-muted text-sm">We&apos;re preparing our next initiatives. Explore upcoming campaigns and our past successes below.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Campaigns */}
              <div className="mb-16">
                <h2 className="text-xl font-serif font-semibold text-primary mb-6">Upcoming Campaigns</h2>
                {upcomingLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : upcomingCampaigns.length === 0 ? (
                  <p className="text-muted text-sm py-6">No upcoming campaigns at the moment.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {upcomingCampaigns.map((item) => (
                      <div key={item.id} className="bg-card rounded-md border border-slate-200 overflow-hidden">
                        <div className="aspect-video overflow-hidden">
                          <img src={item.imageUrl ?? placeholderImage} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif font-semibold text-primary mb-2">{item.title}</h3>
                          <p className="text-muted text-sm line-clamp-2">{item.description}</p>
                          <span className="inline-block mt-3 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-md">Coming Soon</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Successful Campaigns */}
              <div>
                <h2 className="text-xl font-serif font-semibold text-primary mb-6">Past Successful Campaigns</h2>
                {pastLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : pastCampaigns.length === 0 ? (
                  <p className="text-muted text-sm py-6">No past campaigns to display.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pastCampaigns.map((item) => (
                      <div key={item.id} className="bg-card rounded-md border border-slate-200 overflow-hidden">
                        <div className="aspect-video overflow-hidden">
                          <img src={item.imageUrl ?? placeholderImage} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif font-semibold text-primary mb-2">{item.title}</h3>
                          <p className="text-muted text-sm line-clamp-2 mb-3">{item.description}</p>
                          <p className="text-primary font-semibold text-sm">{formatCurrency(item.raisedAmount)} raised</p>
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-muted">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Reports */}
      <section id="reports" className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-primary mb-5 text-center">
            Annual Reports
          </h1>
          <p className="text-muted text-base text-center mb-12 max-w-2xl mx-auto leading-[1.7]">
            Access our annual reports and financial statements. Transparency in our work is important to us.
          </p>
          {reportsLoading ? (
            <div className="text-center text-primary py-12">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="bg-background rounded-md border border-slate-200 p-12 text-center">
              <p className="text-muted font-medium">No reports available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-background rounded-md border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-primary">{r.title}</h2>
                    <p className="text-sm text-muted mt-1">{r.year} • {formatFileSize(r.fileSize)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors">View</a>
                    <a href={r.fileUrl} download={r.fileName} className="px-4 py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors">Download</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-6 flex justify-center border-b border-slate-200">
              <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-10 bg-slate-50/50 border-t lg:border-t-0 lg:border-r border-slate-200">
                <h2 className="text-xl font-serif font-semibold text-primary mb-6">Why Volunteer With Us?</h2>
                <ul className="space-y-6">
                  {whyVolunteer.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">{item.icon}</span>
                      <div>
                        <h3 className="font-serif font-semibold text-primary mb-1">{item.title}</h3>
                        <p className="text-muted text-base leading-[1.6]">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 lg:p-10">
                <h1 className="text-xl font-serif font-semibold text-primary mb-2">Join Our Team</h1>
                <p className="text-muted text-base leading-[1.6] mb-6">Fill in your details and we&apos;ll get in touch soon.</p>
                <VolunteerForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section id="donate" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-serif font-semibold text-[#1B1F23] mb-10 border-b border-slate-200 pb-4">
            Donate
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Official notice, tax info, bank details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Official Donation Notice */}
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-3">Official Donation Notice</h2>
                <p className="text-[#4B5563] text-sm leading-[1.7]">
                  {donationConfig.officialNotice}
                </p>
              </div>

              {/* Tax Benefit Information */}
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-3">Tax Benefit Information</h2>
                <ul className="space-y-2 text-[#4B5563] text-sm leading-[1.6]">
                  {donationConfig.taxBenefitInfo.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0F3D73] mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bank Transfer Details */}
              <div className="border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-3">Bank Transfer</h2>
                <p className="text-[#4B5563] text-sm mb-4">You may transfer funds directly to our bank account:</p>
                {bankLoading ? (
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                    <div className="h-5 bg-slate-100 animate-pulse rounded" />
                  </div>
                ) : (bankDetails && (bankDetails.bankName || bankDetails.accountName || bankDetails.accountNumber || bankDetails.ifsc)) ? (
                  <>
                    <div className="border border-slate-200 overflow-hidden rounded-md">
                      <table className="w-full text-sm">
                        <tbody>
                          {bankDetails.bankName && (
                            <tr className="border-b border-slate-100">
                              <td className="px-4 py-3 text-[#4B5563] w-36">Bank</td>
                              <td className="px-4 py-3 text-[#1B1F23] font-medium">{bankDetails.bankName}</td>
                            </tr>
                          )}
                          {bankDetails.accountName && (
                            <tr className="border-b border-slate-100">
                              <td className="px-4 py-3 text-[#4B5563]">Account Name</td>
                              <td className="px-4 py-3 text-[#1B1F23] font-medium">{bankDetails.accountName}</td>
                            </tr>
                          )}
                          {bankDetails.accountNumber && (
                            <tr className="border-b border-slate-100">
                              <td className="px-4 py-3 text-[#4B5563]">Account Number</td>
                              <td className="px-4 py-3 text-[#1B1F23] font-mono">{bankDetails.accountNumber}</td>
                            </tr>
                          )}
                          {bankDetails.ifsc && (
                            <tr className="border-b border-slate-100">
                              <td className="px-4 py-3 text-[#4B5563]">IFSC</td>
                              <td className="px-4 py-3 text-[#1B1F23] font-mono">{bankDetails.ifsc}</td>
                            </tr>
                          )}
                          {bankDetails.branch && (
                            <tr className="border-b border-slate-100">
                              <td className="px-4 py-3 text-[#4B5563]">Branch</td>
                              <td className="px-4 py-3 text-[#1B1F23] font-medium">{bankDetails.branch}</td>
                            </tr>
                          )}
                          {bankDetails.contactEmail && (
                            <tr>
                              <td className="px-4 py-3 text-[#4B5563]">Contact Email</td>
                              <td className="px-4 py-3">
                                <a href={`mailto:${bankDetails.contactEmail}`} className="text-primary hover:underline">
                                  {bankDetails.contactEmail}
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-[#4B5563] mt-4">
                      Please share the transaction reference and your details at the contact email above for 80G receipt.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="border border-slate-200 overflow-hidden rounded-md">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 text-[#4B5563] w-36">Bank</td>
                            <td className="px-4 py-3 text-[#1B1F23] font-medium">{donationConfig.bankDetails.bankName}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 text-[#4B5563]">Account Name</td>
                            <td className="px-4 py-3 text-[#1B1F23] font-medium">{donationConfig.bankDetails.accountName}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 text-[#4B5563]">Account Number</td>
                            <td className="px-4 py-3 text-[#1B1F23] font-mono">{donationConfig.bankDetails.accountNumber}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 text-[#4B5563]">IFSC</td>
                            <td className="px-4 py-3 text-[#1B1F23] font-mono">{donationConfig.bankDetails.ifsc}</td>
                          </tr>
                          {donationConfig.bankDetails.branch && (
                            <tr className="border-b border-slate-100">
                              <td className="px-4 py-3 text-[#4B5563]">Branch</td>
                              <td className="px-4 py-3 text-[#1B1F23] font-medium">{donationConfig.bankDetails.branch}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-[#4B5563] mt-4">
                      Please share the transaction reference and your details at{" "}
                      <a href={`mailto:${footerConfig.contact.email ?? "contact@klsws.org"}`} className="text-primary hover:underline">
                        {footerConfig.contact.email ?? "contact@klsws.org"}
                      </a>{" "}
                      for 80G receipt.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right: Online Payment Form */}
            <div>
              <div className="border border-slate-200 bg-white p-6 sticky top-24">
                <h2 className="text-lg font-serif font-semibold text-[#1B1F23] mb-1">Secure Online Payment</h2>
                <p className="text-sm text-[#4B5563] mb-6">Pay via card, UPI, or net banking.</p>
                <DonationForm />
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap justify-center gap-6">
              {donationConfig.complianceBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center px-6 py-3 border border-slate-200 bg-white"
                >
                  <span className="text-sm font-medium text-[#1B1F23]">{badge.label}</span>
                  {badge.description && (
                    <span className="text-xs text-[#4B5563] mt-0.5">{badge.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
