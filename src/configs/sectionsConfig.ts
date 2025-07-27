// src/configs/sectionsConfig.ts
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import FaqsSection from "@/components/FaqsSection";

export const sections = [
  { id: "home", label: "Home", Component: HeroSection },
  { id: "how-it-works", label: "How It Works", Component: HowItWorksSection },
  { id: "features", label: "Features", Component: FeaturesSection },
  { id: "faqs", label: "FAQs", Component: FaqsSection },
];
