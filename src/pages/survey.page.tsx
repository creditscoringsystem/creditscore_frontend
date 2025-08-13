// src/pages/survey.page.tsx
'use client';

import React, { useState } from 'react';
import Head from 'next/head';

import HeaderApp from '@/components/HeaderApp';         // nếu không có, thay bằng '@/components/Header'
import SurveyLayout from '@/components/survey/SurveyLayout';
import Step1BasicInfo from '@/components/survey/Step1BasicInfo';
import Step2CreditUsage from '@/components/survey/Step2CreditUsage';
import Step3PaymentHistory from '@/components/survey/Step3PaymentHistory';
import Step4Psychometric from '@/components/survey/Step4Psychometric';

// Tiêu đề từng bước
const sectionTitles = [
  'Basic Information',
  'Credit Usage & Limit',
  'Payment History',
  'Financial Psychology',
];

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep  = (n: number) => setStep(Math.min(Math.max(1, n), totalSteps));
  const handleFinish = () => {
    alert('Survey completed!');
    // TODO: redirect hoặc call API ở đây
  };

  return (
    <>
      <Head><title>Survey | Credit Scoring System</title></Head>

      <HeaderApp />

      <main>
        <SurveyLayout
          step={step}
          totalSteps={totalSteps}
          sectionTitle={sectionTitles[step - 1]}
          onStepClick={goToStep}
        >
          {step === 1 && <Step1BasicInfo onNext={nextStep} />}
          {step === 2 && <Step2CreditUsage onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <Step3PaymentHistory onNext={nextStep} onBack={prevStep} />}
          {step === 4 && <Step4Psychometric onNext={handleFinish} onBack={prevStep} />}
        </SurveyLayout>
      </main>
    </>
  );
}
