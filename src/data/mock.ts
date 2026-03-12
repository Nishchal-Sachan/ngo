import type {
  NavItem,
  WorkItem,
  AboutContent,
  HeroContent,
  SliderImage,
  SiteConfig,
  FooterConfig,
  DonationConfig,
} from "@/types";

export const siteConfig: SiteConfig = {
  organizationName: "Kanhaiya lal Shakya Social Welfare Society",
  copyrightText: "All rights reserved.",
};

export const footerConfig: FooterConfig = {
  quickLinks: [
    { label: "About", href: "/#about" },
    { label: "Our Work", href: "/#work" },
    { label: "Campaigns", href: "/#campaigns" },
    { label: "Reports", href: "/#reports" },
    { label: "Volunteer", href: "/#volunteer" },
    { label: "Donate", href: "/#donate" },
  ],
  contact: {
    email: "contact@klsws.org",
    phone: "+91 98765 43210",
  },
  address: "Kanhaiya Lal Shakya Social Welfare Society, Community Center, India",
  socialLinks: [
    { platform: "Facebook", href: "#", icon: "facebook" },
    { platform: "Twitter", href: "#", icon: "twitter" },
    { platform: "Instagram", href: "#", icon: "instagram" },
  ],
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/#about" },
  { id: "work", label: "Our Work", href: "/#work" },
  { id: "campaigns", label: "Campaigns", href: "/#campaigns" },
  { id: "reports", label: "Reports", href: "/#reports" },
  { id: "join", label: "Volunteer", href: "/#volunteer" },
  { id: "donate", label: "Donate", href: "/#donate" },
  { id: "admin", label: "Admin", href: "/admin/dashboard" },
];

export const heroContent: HeroContent = {
  title: "Kanhaiya lal Shakya Social Welfare Society",
  tagline:
    "Empowering communities, transforming lives. Join us in making a difference for a better tomorrow.",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  description:
    "We are a registered non-profit dedicated to uplifting underprivileged communities through education, healthcare, environmental initiatives, and women empowerment. Our programs create sustainable change and lasting impact.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
};

export const sliderImages: SliderImage[] = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Event 1",
  },
  {
    src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    alt: "Event 2",
  },
  {
    src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    alt: "Event 3",
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    alt: "Event 4",
  },
];

export const aboutContent: AboutContent = {
  title: "About the Organization",
  description:
    "Kanhaiya Lal Shakya Social Welfare Society was established in 2015 as a registered non-profit organization under the Societies Registration Act, 1860. The organization operates with the objective of addressing socio-economic challenges in underprivileged communities through structured programs in education, healthcare, environmental conservation, and women empowerment. All activities are conducted in accordance with applicable statutory requirements and governance standards.",
  imageUrl:
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
  imageAlt: "Kanhaiya Lal Shakya Social Welfare Society",
  vision:
    "To build an equitable society where every individual has access to education, healthcare, and opportunities for sustainable livelihood.",
  mission:
    "To implement evidence-based programs that empower underprivileged communities through education, healthcare delivery, environmental initiatives, and capacity-building, while maintaining transparency and accountability in all operations.",
  coreObjectives: [
    "Provide access to quality education for underprivileged children and youth.",
    "Conduct healthcare outreach programs in rural and underserved areas.",
    "Implement environmental conservation and afforestation initiatives.",
    "Support women empowerment through skill development and livelihood programs.",
    "Ensure transparent governance and compliance with regulatory requirements.",
  ],
  legalInfo: {
    registrationNumber: "REG/2015/XXXX",
    registeredUnder: "Societies Registration Act, 1860",
    eightyGCompliant: true,
    twelveACompliant: true,
  },
  boardMembers: [
    { name: "Shri Kanhaiya Lal Shakya", role: "President" },
    { name: "Smt. [Name]", role: "Vice President" },
    { name: "Shri [Name]", role: "Secretary" },
    { name: "Shri [Name]", role: "Treasurer" },
    { name: "Shri [Name]", role: "Member" },
    { name: "Smt. [Name]", role: "Member" },
  ],
  orgStructureSummary:
    "The organization is governed by a Board of Management comprising elected office bearers and members. Day-to-day operations are overseen by the Secretary under the direction of the Board. Program implementation is carried out through designated coordinators for each vertical: Education, Healthcare, Environment, and Women Empowerment.",
};

export const workItems: WorkItem[] = [
  {
    id: "1",
    title: "Free Medical Camps",
    description:
      "We organize regular health camps in rural areas, providing free check-ups, basic treatments, and health awareness to underserved communities.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Free medical camp",
    icon: "medical",
  },
  {
    id: "2",
    title: "Plantation Drives",
    description:
      "Our tree plantation initiatives help restore green cover, combat climate change, and create sustainable environments for future generations.",
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Plantation drive",
    icon: "tree",
  },
  {
    id: "3",
    title: "Covid Relief Food Distribution",
    description:
      "During the pandemic, we distributed essential food supplies to families in need, ensuring no one went hungry during difficult times.",
    imageUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Food distribution",
    icon: "food",
  },
  {
    id: "4",
    title: "Free Tuition Programs",
    description:
      "We offer free tuition and educational support to underprivileged students, helping them build a brighter future through quality education.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Free tuition program",
    icon: "education",
  },
];

export const sampleActiveCampaigns = [
  {
    id: "sample-1",
    title: "Rural Health Camp 2026",
    description:
      "Bringing free medical check-ups, basic treatments, and health awareness to remote villages. Your support helps us reach more families in need.",
    goalAmount: 500000,
    raisedAmount: 280000,
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-01-01",
  },
];

export const donationConfig: DonationConfig = {
  officialNotice:
    "Donations to Kanhaiya Lal Shakya Social Welfare Society are voluntary contributions towards our charitable programs. All donations are used exclusively for the stated objectives of the organization. We maintain complete transparency in the utilization of funds and publish annual reports for public scrutiny.",
  taxBenefitInfo: [
    "Donations are eligible for 50% tax deduction under Section 80G of the Income Tax Act, 1961.",
    "We hold valid 80G and 12A registration. Tax exemption certificates are issued upon request.",
    "PAN is required for donations above ₹2,000 to issue 80G receipt.",
    "80G receipts are sent via email within 7–10 working days of donation.",
  ],
  bankDetails: {
    bankName: "State Bank of India",
    accountName: "Kanhaiya Lal Shakya Social Welfare Society",
    accountNumber: "XXXXXXXXXXXX",
    ifsc: "SBIN000XXXX",
    branch: "Main Branch",
  },
  complianceBadges: [
    { label: "80G Registered", description: "Tax exempt" },
    { label: "12A Compliant", description: "Charitable trust" },
    { label: "PCI-DSS", description: "Secure payments" },
    { label: "Registered NGO", description: "Societies Act 1860" },
  ],
};

export const occupationOptions = [
  "Student",
  "Teacher",
  "Doctor",
  "Engineer",
  "Business",
  "Farmer",
  "Homemaker",
  "Retired",
  "Other",
] as const;
