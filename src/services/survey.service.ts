// src/services/survey.service.ts
import api from '@/lib/apiClient';

// Map FE answers (camelCase) to Score Service expected labels (snake_case)
// and ensure all required fields exist with valid defaults
function mapToSurveyAnswersIn(src: Record<string, string> = {}): Record<string, string> {
  const m: Record<string, string> = {};
  const mapKey = (k: string) => ({
    jobType: 'job_type',
    creditCards: 'credit_cards',
    creditUsage: 'credit_usage',
    payFullOnTime: 'pay_full_on_time',
    cardBlocked: 'card_blocked',
    late12m: 'late_12m',
    payTiming: 'pay_timing',
    lateFee: 'late_fee',
    marketBehavior: 'market_behavior',
    willingToBorrow: 'willing_to_borrow',
    urgentMoney: 'urgent_money',
    largeMoneyUse: 'large_money_use',
  } as const)[k] ?? k; // pass-through for keys already snake_case like age, income

  for (const [k, v] of Object.entries(src)) {
    const nk = mapKey(k);
    if (typeof v !== 'undefined' && v !== null && v !== '') m[nk] = v as string;
  }
  // Fill required defaults per OpenAPI if missing
  const withDefaults: Record<string, string> = {
    age: '25-34',
    income: '10-20m',
    job_type: 'employee',
    credit_cards: '1',
    credit_usage: '11-30%',
    pay_full_on_time: 'yes',
    card_blocked: 'no',
    late_12m: '0',
    pay_timing: 'on_time',
    late_fee: 'no',
    market_behavior: 'hold',
    willing_to_borrow: 'maybe',
    urgent_money: 'bank',
    large_money_use: 'save',
  };
  for (const [reqKey, defVal] of Object.entries(withDefaults)) {
    if (!(reqKey in m)) m[reqKey] = defVal;
  }
  return m;
}

export async function submitSurvey(answers: Record<string, string>) {
  // Gửi toàn bộ câu trả lời
  const { data } = await api.post('/api/v1/survey/submit', { answers });
  return data; // có thể trả surveyId/message
}

// Tính điểm và lưu
export async function calculateScore(userId: string, answers?: Record<string, string>) {
  // Score Service yêu cầu payload là SurveyAnswersIn (flat fields), không bọc {answers}
  // Lưu ý: BE đánh dấu requestBody là required. Nếu không có answers sẽ có thể 422.
  const payload = mapToSurveyAnswersIn(answers ?? {});
  const { data } = await api.post(`/api/v1/scores/${userId}/calculate`, payload);
  return data; // { user_id, current_score, category, ... }
}

// Lấy điểm hiện tại
export async function getCurrentScore(userId: string) {
  const { data } = await api.get(`/api/v1/scores/${userId}`);
  return data; // { score, band, updatedAt, recommendations? }
}

// Lịch sử điểm
export async function getScoreHistory(userId: string) {
  const { data } = await api.get(`/api/v1/scores/${userId}/history`);
  return data;
}

// Mô phỏng What-If (không lưu)
export async function simulateScore(userId: string, hypotheticalAnswers: Record<string, string>) {
  // Score Service yêu cầu payload là SurveyAnswersIn (flat fields)
  const payload = mapToSurveyAnswersIn(hypotheticalAnswers);
  const { data } = await api.post(`/api/v1/scores/${userId}/simulate`, payload);
  return data;
}