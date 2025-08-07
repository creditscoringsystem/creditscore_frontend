// src/components/survey/SurveyLayout.tsx
import { ReactNode } from "react";
import ProgressSteps from "@/components/survey/ProgressSteps";

interface SurveyLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
  sectionTitle: string;
  onStepClick?: (step: number) => void; // Thêm prop callback click
}

export default function SurveyLayout({
  children,
  step,
  totalSteps,
  sectionTitle,
  onStepClick
}: SurveyLayoutProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-green-100 via-lime-100 to-green-200 pt-16">
      <main className="flex-1 flex justify-center items-stretch">
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md border border-white/60 rounded-3xl shadow-xl mx-auto flex flex-col justify-start h-full py-10 px-5 sm:px-10">
          {/* Progress stepper nằm trên cùng */}
          <ProgressSteps step={step} totalSteps={totalSteps} onStepClick={onStepClick} />

          <div className="mb-8 text-2xl font-bold text-green-900 tracking-wide">
            {sectionTitle}
          </div>
          <div className="flex-1 flex flex-col justify-between">{children}</div>
        </div>
      </main>
    </div>
  );
}
