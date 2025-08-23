// src/services/survey.service.ts
import api from '@/lib/apiClient';
import { surveyConfig } from '@/configs/surveyConfig';

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

// Lấy danh sách câu hỏi từ Survey Service
export async function getSurveyQuestions(): Promise<Array<{ id: number; key?: string; label?: string }>> {
  const { data } = await api.get('/api/v1/survey/questions');
  return Array.isArray(data) ? data : [];
}

// Chuẩn hoá chuỗi để so sánh label gần đúng
function norm(s?: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Xây map từ FE key -> label hiển thị (lấy từ surveyConfig)
function buildFeKeyToLabelMap(): Record<string, string> {
  const m: Record<string, string> = {};
  for (const step of surveyConfig) {
    for (const q of step) {
      m[q.key] = q.label;
    }
  }
  return m;
}

// Gửi khảo sát theo schema SurveySubmitRequest
export async function submitSurvey(userId: string, answers: Record<string, string>) {
  // Tải câu hỏi từ BE để lấy question_id
  const questions = await getSurveyQuestions();
  const byKey = new Map<string, { id: number; key?: string; label?: string }>();
  const byLabel = new Map<string, { id: number; key?: string; label?: string }>();
  for (const q of questions) {
    if (q.key) byKey.set(q.key, q);
    if (q.label) byLabel.set(norm(q.label), q);
  }

  const feKeyToLabel = buildFeKeyToLabelMap();

  const payload = {
    user_id: userId,
    answers: [] as Array<{ user_id: string; question_id: number; answer: string }>,
  };

  for (const [k, v] of Object.entries(answers || {})) {
    if (v == null || v === '') continue;
    let q = byKey.get(k);
    if (!q) {
      const label = feKeyToLabel[k];
      if (label) q = byLabel.get(norm(label));
    }
    if (q && typeof q.id === 'number') {
      payload.answers.push({ user_id: userId, question_id: q.id, answer: String(v) });
    }
  }

  const { data } = await api.post('/api/v1/survey/submit', payload);
  return data; // message/result from Survey Service
}

// Tính điểm và lưu
export async function calculateScore(userId: string, answers?: Record<string, string>) {
  // Score Service yêu cầu payload là SurveyAnswersIn (flat fields), không bọc {answers}
  // Lưu ý: BE đánh dấu requestBody là required. Nếu không có answers sẽ có thể 422.
  const payload = mapToSurveyAnswersIn(answers ?? {});
  const { data } = await api.post(`/api/v1/scores/${userId}`, payload);
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
  // Score Service trả { user_id, history: [...] }
  return Array.isArray(data?.history) ? data.history : data;
}

// Yếu tố ảnh hưởng điểm và gợi ý
export async function getScoreFactors(userId: string) {
  const { data } = await api.get(`/api/v1/scores/${userId}/factors`);
  return data; // { user_id, factors: [...], recommendations: [...] }
}

// Mô phỏng What-If (không lưu)
export async function simulateScore(userId: string, hypotheticalAnswers: Record<string, string>) {
  // Score Service yêu cầu payload là SurveyAnswersIn (flat fields)
  const payload = mapToSurveyAnswersIn(hypotheticalAnswers);
  const { data } = await api.post(`/api/v1/scores/${userId}/simulate`, payload);
  return data;
}

// Mô phỏng What-If kèm projection theo tháng (không lưu)
export async function simulateProjection(userId: string, hypotheticalAnswers: Record<string, string>) {
  const payload = mapToSurveyAnswersIn(hypotheticalAnswers);
  const { data } = await api.post(`/api/v1/scores/${userId}/simulate/projection`, payload);
  return data; // ProjectionOut { score, category, confidence?, projection[], summary }
}