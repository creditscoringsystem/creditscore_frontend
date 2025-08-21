// src/pages/survey.tsx
'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import HeaderApp from '@/components/HeaderApp';
import SurveyLayout from '@/components/survey/SurveyLayout';
import Step1BasicInfo from '@/components/survey/Step1BasicInfo';
import Step2CreditUsage from '@/components/survey/Step2CreditUsage';
import Step3PaymentHistory from '@/components/survey/Step3PaymentHistory';
import Step4Psychometric from '@/components/survey/Step4Psychometric';
import { useSurvey } from '@/contexts/SurveyContext';
import { submitSurvey, calculateScore } from '@/services/survey.service';
import { getToken } from '@/services/auth.service';

// Decode JWT (Base64URL) on client only
function decodeJwt(token: string): any {
  try {
    if (typeof window === 'undefined' || !('atob' in window)) return null;
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = window.atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const sectionTitles = [
  'Basic Information',
  'Credit Usage & Limit',
  'Payment History',
  'Financial Psychology',
];

export default function SurveyPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const { answers } = useSurvey();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep  = (n: number) => setStep(Math.min(Math.max(1, n), totalSteps));

  const handleFinish = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // Gửi khảo sát về BE chính (nếu route chưa sẵn qua Kong, bỏ qua lỗi và tiếp tục)
      try {
        await submitSurvey(answers as Record<string, string>);
      } catch (subErr) {
        // Không chặn luồng nếu submit survey thất bại
        // TODO: có thể ghi log hoặc gửi telemetry nếu cần
      }
      // Lấy userId từ JWT để tính điểm và lưu
      const token = getToken();
      const claims = token ? decodeJwt(token) : null;
      const userId: string | undefined =
        claims?.sub || claims?.user_id || claims?.uid || claims?.id;

      if (userId) {
        // Gửi thẳng câu trả lời theo format SurveyAnswersIn tới Score Service
        const result = await calculateScore(userId, answers as Record<string, string>);
        // Lưu tạm để dashboard hiển thị ngay (tránh phụ thuộc việc persist bên BE)
        try {
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('latest_score_payload', JSON.stringify(result ?? {}));
          }
        } catch {}
      }
      // Điều hướng về trang tổng quan điểm
      router.push('/dashboard/credit-score-overview-dashboard');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Có lỗi khi tính điểm';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
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
        {error && (
          <p className="text-center text-red-500 mt-4 text-sm">{error}</p>
        )}
        {submitting && (
          <p className="text-center text-gray-500 mt-2 text-sm">Submitting survey…</p>
        )}
      </main>
    </>
  );
}
