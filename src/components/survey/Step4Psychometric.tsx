// src/components/survey/Step4Psychometric.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/router'; // Pages Router
import { useSurvey } from '@/contexts/SurveyContext';
import CustomSelect from '@/components/common/CustomSelect';
import { surveyConfig } from '@/configs/surveyConfig';

type Option = { value: string; label: string };

export default function Step4Psychometric({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const { answers, setAnswers } = useSurvey();
  const questions = surveyConfig[3];

  const [values, setValues] = useState<Record<string, Option>>(
    questions.reduce((acc, q) => {
      acc[q.key] =
        q.options.find((o: Option) => o.value === (answers as any)[q.key]) ||
        (q.options[0] as Option);
      return acc;
    }, {} as Record<string, Option>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSelectChange = (key: string, option: Option) => {
    setValues((prev) => ({ ...prev, [key]: option }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    questions.forEach((q: any) => {
      if (!values[q.key]?.value) newErrors[q.key] = 'Please select an option.';
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newAnswer = Object.fromEntries(
        questions.map((q: any) => [q.key, values[q.key]?.value])
      );
      setAnswers(newAnswer);

      // Nếu bạn vẫn muốn trigger callback để đóng step/wizard trong UI hiện tại:
      onNext?.();

      // ✅ Điều hướng sang trang Dashboard
      router.push('/dashboard');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl w-full mx-auto p-2 sm:p-6 font-poppins"
    >
      {questions.map((q: any) => (
        <CustomSelect
          key={q.key}
          options={q.options}
          value={values[q.key]}
          onChange={(opt: Option) => onSelectChange(q.key, opt)}
          label={q.label}
          error={errors[q.key]}
        />
      ))}

      <div className="flex justify-between gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-gray-100 hover:bg-gray-200 text-green-700 font-bold px-10 py-3 shadow-md border-none transition-all duration-200 active:scale-95"
        >
          Back
        </button>

        <button
          type="submit"
          className="rounded-full bg-green-700/90 hover:bg-green-600 text-white font-bold px-10 py-3 shadow-lg hover:shadow-green-300 focus:ring-4 focus:ring-green-300 border-none transition-all duration-200 active:scale-95"
        >
          Finish
        </button>
      </div>
    </form>
  );
}
