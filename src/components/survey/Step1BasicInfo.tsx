import { useState } from "react";
import { useSurvey } from "@/contexts/SurveyContext";
import CustomSelect from "@/components/common/CustomSelect";
import { surveyConfig } from "@/configs/surveyConfig";

export default function Step1BasicInfo({ onNext }) {
  const { answers, setAnswers } = useSurvey();
  const questions = surveyConfig[0];

  const [values, setValues] = useState(
    questions.reduce((acc, q) => {
      acc[q.key] = q.options.find((o) => o.value === answers[q.key]) || q.options[0];
      return acc;
    }, {} as Record<string, { value: string; label: string }>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSelectChange = (key: string, option: { value: string; label: string }) => {
    setValues((prev) => ({ ...prev, [key]: option }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    questions.forEach((q) => {
      if (!values[q.key]?.value) newErrors[q.key] = "Please select an option.";
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newAnswer = Object.fromEntries(
        questions.map((q) => [q.key, values[q.key]?.value])
      );
      setAnswers(newAnswer);
      onNext();
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl w-full mx-auto p-2 sm:p-6 font-poppins">
      {questions.map((q) => (
        <CustomSelect
          key={q.key}
          options={q.options}
          value={values[q.key]}
          onChange={(opt) => onSelectChange(q.key, opt)}
          label={q.label}
          error={errors[q.key]}
        />
      ))}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="submit"
          className="rounded-full bg-green-700/90 hover:bg-green-600 text-white font-bold px-10 py-3 shadow-lg hover:shadow-green-300 focus:ring-4 focus:ring-green-300 border-none transition-all duration-200 active:scale-95"
        >
          Next
        </button>
      </div>
    </form>
  );
}
