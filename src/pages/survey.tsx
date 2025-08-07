// src/pages/survey.tsx
import { useState } from "react";
import SurveyLayout from "@/components/survey/SurveyLayout";
import Step1BasicInfo from "@/components/survey/Step1BasicInfo";
import Step2CreditUsage from "@/components/survey/Step2CreditUsage";
import Step3PaymentHistory from "@/components/survey/Step3PaymentHistory";
import Step4Psychometric from "@/components/survey/Step4Psychometric";
import HeaderApp from "@/components/HeaderApp";

// Các tên section tiếng Anh tương ứng từng bước
const sectionTitles = [
  "Basic Information",
  "Credit Usage & Limit",
  "Payment History",
  "Financial Psychology",
];

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleFinish = () => {
    alert("Survey completed!"); // Ở đây bạn có thể redirect sang dashboard hoặc xử lý tiếp
  };

  // Hàm chuyển bước khi click stepper
  const goToStep = (stepNum: number) => {
    setStep(stepNum);
  };

  return (
    <>
      <HeaderApp />
      <SurveyLayout
        step={step}
        totalSteps={totalSteps}
        sectionTitle={sectionTitles[step - 1]}
        onStepClick={goToStep} // Truyền callback cho stepper click
      >
        {step === 1 && <Step1BasicInfo onNext={nextStep} />}
        {step === 2 && <Step2CreditUsage onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <Step3PaymentHistory onNext={nextStep} onBack={prevStep} />}
        {step === 4 && <Step4Psychometric onNext={handleFinish} onBack={prevStep} />}
      </SurveyLayout>
    </>
  );
}
