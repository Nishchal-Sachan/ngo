import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";
import { siteConfig } from "@/data/mock";

export const metadata: Metadata = {
  title: `${siteConfig.organizationName} | Empowering Communities`,
  description:
    "Empowering communities, transforming lives since 2015. Education, healthcare, environmental sustainability, and women empowerment. Donate, volunteer, or support our campaigns.",
  keywords: ["NGO", "social welfare", "community", "donate", "volunteer", "education", "healthcare"],
  openGraph: {
    title: `${siteConfig.organizationName}`,
    description: "Empowering communities, transforming lives. Support our mission through donation or volunteering.",
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
