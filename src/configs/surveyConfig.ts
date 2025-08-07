// src/configs/surveyConfig.ts

/**
 * Hướng dẫn thay đổi cấu hình câu hỏi khảo sát (Survey):
 * ------------------------------------------------------
 * 1. surveyConfig là mảng các bước (Step), mỗi bước là 1 mảng các câu hỏi (SurveyQuestion[]).
 * 2. Mỗi câu hỏi gồm:
 *      - key   : định danh duy nhất (FE và BE phải thống nhất để lấy dữ liệu)
 *      - label : nội dung hiển thị cho câu hỏi (có thể đổi tùy ý)
 *      - options: mảng đáp án cho câu hỏi (mỗi option có value và label)
 * 3. Khi muốn ĐỔI, THÊM, XOÁ:
 *      - ĐỔI nội dung câu hỏi: Sửa trường "label" của câu hỏi tương ứng.
 *      - ĐỔI option/đáp án   : Sửa, thêm, xoá trong mảng "options".
 *      - THÊM câu hỏi mới    : Thêm 1 object mới vào mảng step tương ứng.
 *      - XOÁ câu hỏi         : Xoá object khỏi mảng step tương ứng.
 *      - ĐỔI thứ tự câu hỏi  : Đổi vị trí object trong mảng step.
 * 4. Sau khi chỉnh, **KHÔNG cần đổi code trong các Step của FE**. FE tự render động theo file này.
 * 5. BE khi xuất cấu hình, trả về đúng format là FE dùng được ngay.
 */

export type SurveyOption = { value: string; label: string; };

export type SurveyQuestion = {
  key: string;
  label: string;
  options: SurveyOption[];
};

export const surveyConfig: SurveyQuestion[][] = [
  // Step 1
  [
    {
      key: "age",
      label: "What is your age?",
      options: [
        { value: "", label: "Select" },
        { value: "18-24", label: "18–24" },
        { value: "25-34", label: "25–34" },
        { value: "35-50", label: "35–50" },
        { value: "51+", label: "51+" },
      ]
    },
    {
      key: "income",
      label: "What is your monthly income?",
      options: [
        { value: "", label: "Select" },
        { value: "<5m", label: "Below 5 million VND" },
        { value: "5-10m", label: "5–10 million VND" },
        { value: "10-20m", label: "10–20 million VND" },
        { value: "20-50m", label: "20–50 million VND" },
        { value: ">50m", label: "Above 50 million VND" },
      ]
    },
    {
      key: "jobType",
      label: "What is your employment type?",
      options: [
        { value: "", label: "Select" },
        { value: "freelance", label: "Freelance / Temporary" },
        { value: "staff", label: "Permanent Staff" },
        { value: "manager", label: "Manager / Director" },
      ]
    },
  ],
  // Step 2
  [
    {
      key: "numCards",
      label: "How many credit cards do you have?",
      options: [
        { value: "", label: "Select" },
        { value: "0", label: "0" },
        { value: "1", label: "1" },
        { value: "2-3", label: "2–3" },
        { value: "4+", label: "4 or more" },
      ]
    },
    {
      key: "creditUsage",
      label: "What percentage of your credit limit do you use on average?",
      options: [
        { value: "", label: "Select" },
        { value: "<10%", label: "Less than 10%" },
        { value: "11-30%", label: "11% – 30%" },
        { value: "31-50%", label: "31% – 50%" },
        { value: "51-70%", label: "51% – 70%" },
        { value: ">70%", label: "More than 70%" },
      ]
    },
    {
      key: "payOnTime",
      label: "Do you always pay your credit card bills on time?",
      options: [
        { value: "", label: "Select" },
        { value: "yes", label: "Yes" },
        { value: "sometimes", label: "Sometimes" },
        { value: "no", label: "No" },
      ]
    },
    {
      key: "cardSuspended",
      label: "Have you ever had your credit card suspended?",
      options: [
        { value: "", label: "Select" },
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ]
    },
  ],
  // Step 3
  [
    {
      key: "lateTimes",
      label: "In the past 12 months, how many times did you pay late?",
      options: [
        { value: "", label: "Select" },
        { value: "0", label: "0" },
        { value: "1-2", label: "1–2" },
        { value: "3-5", label: "3–5" },
        { value: "6+", label: "6 or more" },
      ]
    },
    {
      key: "paymentHabit",
      label: "How do you usually pay your bills?",
      options: [
        { value: "", label: "Select" },
        { value: "early", label: "Before due date" },
        { value: "ontime", label: "On due date" },
        { value: "late", label: "After due date" },
      ]
    },
    {
      key: "penalty",
      label: "Have you ever been penalized for late payment?",
      options: [
        { value: "", label: "Select" },
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ]
    },
  ],
  // Step 4
  [
    {
      key: "marketReaction",
      label: "When the market fluctuates, what do you usually do?",
      options: [
        { value: "", label: "Select" },
        { value: "hold", label: "Hold position" },
        { value: "invest", label: "Invest more" },
        { value: "withdraw", label: "Withdraw money" },
      ]
    },
    {
      key: "loanWillingness",
      label: "Are you willing to borrow to invest?",
      options: [
        { value: "", label: "Select" },
        { value: "yes", label: "Yes" },
        { value: "maybe", label: "Maybe" },
        { value: "no", label: "No" },
      ]
    },
    {
      key: "emergencyAction",
      label: "If you need money urgently, what will you do?",
      options: [
        { value: "", label: "Select" },
        { value: "friends", label: "Borrow from friends/family" },
        { value: "bank", label: "Bank loan" },
        { value: "credit_card", label: "Use credit card" },
      ]
    },
    {
      key: "windfallAction",
      label: "When receiving a large sum of money, what do you do?",
      options: [
        { value: "", label: "Select" },
        { value: "invest", label: "Invest" },
        { value: "save", label: "Save" },
        { value: "spend", label: "Spend" },
      ]
    },
  ],
];
