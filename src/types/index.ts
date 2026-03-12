export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface WorkItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  icon?: string;
}

export interface BoardMember {
  name: string;
  role: string;
}

export interface LegalInfo {
  registrationNumber: string;
  registeredUnder: string;
  eightyGCompliant: boolean;
  twelveACompliant: boolean;
}

export interface AboutContent {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  vision?: string;
  mission?: string;
  coreObjectives?: string[];
  legalInfo?: LegalInfo;
  boardMembers?: BoardMember[];
  orgStructureSummary?: string;
}

export interface HeroContent {
  title: string;
  tagline: string;
  backgroundImageUrl: string;
  description?: string;
  heroImageUrl?: string;
}

export interface SliderImage {
  src: string;
  alt: string;
}

export type Occupation =
  | "student"
  | "teacher"
  | "doctor"
  | "engineer"
  | "business"
  | "farmer"
  | "homemaker"
  | "retired"
  | "other";

export interface VolunteerFormData {
  name: string;
  phone: string;
  email: string;
  occupation: Occupation | "";
  occupationOther?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  fatherName: string;
  qualification: string;
}

export interface DonationFormData {
  name: string;
  email?: string;
  phone: string;
  amount: number;
  pan: string;
}

export interface SiteConfig {
  organizationName: string;
  copyrightText: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface FooterConfig {
  quickLinks: FooterLink[];
  contact: {
    email?: string;
    phone?: string;
  };
  address?: string;
  socialLinks?: SocialLink[];
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch?: string;
}

export interface DonationConfig {
  officialNotice: string;
  taxBenefitInfo: string[];
  bankDetails: BankDetails;
  complianceBadges: { label: string; description?: string }[];
}
