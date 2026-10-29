 

// import api from "./api";

// export interface QuizResult {
//   id: string;
//   quizName: string;
//   score: number;
//   maxScore: number;
//   takenAt?: string | null;
//   studentId: string;
// }

// export interface CreateQuizResultInput {
//   quizName: string;
//   score: number;
//   maxScore: number;
//   studentId: string;
//   takenAt?: string;
// }

// export interface UpdateQuizResultInput {
//   quizName?: string;
//   score?: number;
//   maxScore?: number;
//   takenAt?: string;
// }

// interface ApiPayload {
//   result?: QuizResult;
//   results?: QuizResult[];
//   data?: unknown;
//   message?: string;
//   count?: number;
// }

// function unwrapPayload(data: unknown): unknown {
//   if (
//     typeof data === "object" &&
//     data !== null &&
//     "data" in data
//   ) {
//     return (data as ApiPayload).data;
//   }

//   return data;
// }

// function extractResult(data: unknown): QuizResult {
//   const payload = unwrapPayload(data);

//   if (
//     typeof payload === "object" &&
//     payload !== null &&
//     "result" in payload
//   ) {
//     return (payload as ApiPayload).result as QuizResult;
//   }

//   return payload as QuizResult;
// }

// /**
//  * Fetch quiz results for a student.
//  * Backend response: { count, results }
//  */
// export async function getQuizResultsByStudent(
//   studentId: string,
// ): Promise<QuizResult[]> {
//   const response = await api.get(
//     `/quiz-results/student/${encodeURIComponent(studentId)}`,
//   );

//   const payload = unwrapPayload(response.data);

//   if (
//     typeof payload === "object" &&
//     payload !== null &&
//     "results" in payload
//   ) {
//     const results = (payload as ApiPayload).results;
//     return Array.isArray(results) ? results : [];
//   }

//   // Also support a direct array response.
//   return Array.isArray(payload) ? payload as QuizResult[] : [];
// }

// /**
//  * Create a quiz result.
//  * Backend response: { message, result }
//  */
// export async function createQuizResult(
//   input: CreateQuizResultInput,
// ): Promise<QuizResult> {
//   const response = await api.post("/quiz-results", {
//     quizName: input.quizName,
//     score: input.score,
//     maxScore: input.maxScore,
//     studentId: input.studentId,
//     ...(input.takenAt ? { takenAt: input.takenAt } : {}),
//   });

//   return extractResult(response.data);
// }

// /**
//  * Update an existing quiz result.
//  * Backend response: { message, result }
//  */
// export async function updateQuizResult(
//   resultId: string,
//   input: UpdateQuizResultInput,
// ): Promise<QuizResult> {
//   const response = await api.patch(
//     `/quiz-results/${encodeURIComponent(resultId)}`,
//     input,
//   );

//   return extractResult(response.data);
// }

// /**
//  * Delete a quiz result.
//  */
// export async function deleteQuizResult(
//   resultId: string,
// ): Promise<void> {
//   await api.delete(
//     `/quiz-results/${encodeURIComponent(resultId)}`,
//   );
// }
// ----------------------------------------------------------------------



import api from "./api";

export interface QuizResult {
  id: string;
  quizName: string;
  score: number;
  maxScore: number;
  needsSupport: boolean;
  takenAt?: string | null;
  studentId: string;
}

export interface CreateQuizResultInput {
  quizName: string;
  score: number;
  maxScore: number;
  studentId: string;
  needsSupport: boolean;
  takenAt?: string;
}

export interface UpdateQuizResultInput {
  quizName?: string;
  score?: number;
  maxScore?: number;
  takenAt?: string;
  needsSupport?: boolean;
}

interface ApiPayload {
  result?: QuizResult;
  results?: QuizResult[];
  data?: unknown;
  message?: string;
  count?: number;
}

function unwrapPayload(data: unknown): unknown {
  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data
  ) {
    return (data as ApiPayload).data;
  }

  return data;
}

function extractResult(data: unknown): QuizResult {
  const payload = unwrapPayload(data);

  if (
    typeof payload === "object" &&
    payload !== null &&
    "result" in payload
  ) {
    return (payload as ApiPayload).result as QuizResult;
  }

  return payload as QuizResult;
}

export async function getQuizResultsByStudent(
  studentId: string,
): Promise<QuizResult[]> {
  const response = await api.get(
    `/quiz-results/student/${encodeURIComponent(studentId)}`,
  );

  const payload = unwrapPayload(response.data);

  if (
    typeof payload === "object" &&
    payload !== null &&
    "results" in payload
  ) {
    const results = (payload as ApiPayload).results;
    return Array.isArray(results) ? results : [];
  }

  return Array.isArray(payload) ? (payload as QuizResult[]) : [];
}

export async function createQuizResult(
  input: CreateQuizResultInput,
): Promise<QuizResult> {
  const response = await api.post("/quiz-results", {
    quizName: input.quizName,
    score: input.score,
    maxScore: input.maxScore,
    studentId: input.studentId,
    needsSupport: input.needsSupport,
    ...(input.takenAt ? { takenAt: input.takenAt } : {}),
  });

  return extractResult(response.data);
}

export async function updateQuizResult(
  resultId: string,
  input: UpdateQuizResultInput,
): Promise<QuizResult> {
  const response = await api.patch(
    `/quiz-results/${encodeURIComponent(resultId)}`,
    input,
  );

  return extractResult(response.data);
}

export async function deleteQuizResult(
  resultId: string,
): Promise<void> {
  await api.delete(
    `/quiz-results/${encodeURIComponent(resultId)}`,
  );
}
