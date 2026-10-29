 
import api from './api'

export interface AskAIResponse {
  answer: string
}

export interface AskAIInput {
  classroomId?: string | undefined
  question: string
}

export async function askAI({
  classroomId,
  question,
}: AskAIInput): Promise<AskAIResponse> {
  const response = await api.post('/ai/ask', {
    classroomId,
    question,
  })

  const payload = response.data?.data ?? response.data

  const answer =
    payload?.answer ??
    payload?.response ??
    payload?.result ??
    (typeof payload === 'string' ? payload : undefined)

  if (typeof answer !== 'string' || !answer.trim()) {
    throw new Error(
      'The AI response did not contain an answer. Please check the API response format.',
    )
  }

  return { answer }
}
