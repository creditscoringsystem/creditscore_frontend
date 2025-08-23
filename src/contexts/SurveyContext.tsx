// src/contexts/SurveyContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface SurveyAnswers {
  // Step 1
  age?: string;
  income?: string;
  jobType?: string;
  // Add more for next steps
}

interface SurveyContextType {
  answers: SurveyAnswers;
  setAnswers: (a: SurveyAnswers) => void;
  resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function useSurvey() {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("SurveyContext not found");
  return ctx;
}

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswersState] = useState<SurveyAnswers>({});

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const saved = window.localStorage.getItem("surveyAnswers");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') setAnswersState(parsed);
        } catch {
          // JSON hỏng -> xoá để tránh lỗi lần sau
          window.localStorage.removeItem("surveyAnswers");
        }
      }
    } catch {
      // localStorage không khả dụng, bỏ qua
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem("surveyAnswers", JSON.stringify(answers));
      }
    } catch {
      // ignore write errors
    }
  }, [answers]);

  const setAnswers = (a: SurveyAnswers) => setAnswersState((prev) => ({ ...prev, ...a }));
  const resetSurvey = () => setAnswersState({});

  return (
    <SurveyContext.Provider value={{ answers, setAnswers, resetSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
}
