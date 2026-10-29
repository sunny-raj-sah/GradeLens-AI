 
// import api from './api'

 
// export interface Submission {
//   id?: string
//   homeworkId: string
//   studentId?: string
//   student?: {
//     id?: string
//     fullName?: string
//     rollNumber?: string
//   } | null
//   score?: number | null
//   maxScore?: number | null
//   submittedAt?: string | null
//   feedback?: string | null
// }

// export interface CreateSubmissionInput {
//   homeworkId: string
//   studentId: string
//   score?: number
//   maxScore?: number
//   submittedAt?: string
//   feedback?: string
// }

// export interface UpdateSubmissionInput {
//   score?: number
//   maxScore?: number
//   feedback?: string
// }

// export async function getSubmissionsByHomework(
//   homeworkId: string,
// ): Promise<Submission[]> {
//   const response = await api.get(
//     `/submissions/homework/${homeworkId}`,
//   )

//   const payload = response.data?.data ?? response.data

//   if (Array.isArray(payload)) return payload
//   if (Array.isArray(payload?.submissions)) return payload.submissions

//   return []
// }

// export async function createSubmission(
//   input: CreateSubmissionInput,
// ): Promise<Submission> {
//   const response = await api.post('/submissions', input)
//   const payload = response.data?.data ?? response.data

//   return payload?.submission ?? payload
// }

// /*
//  * FUTURE BACKEND FEATURE — UPDATE SUBMISSION
//  *
//  * Uncomment after implementing and authorizing a backend route,
//  * for example PATCH /api/submissions/:submissionId.
//  *
//  * export async function updateSubmission(
//  *   submissionId: string,
//  *   input: UpdateSubmissionInput,
//  * ): Promise<Submission> {
//  *   const response = await api.patch(
//  *     `/submissions/${submissionId}`,
//  *     input,
//  *   )
//  *
//  *   const payload = response.data?.data ?? response.data
//  *   return payload?.submission ?? payload
//  * }
//  */

// /*
//  * FUTURE BACKEND FEATURE — DELETE SUBMISSION
//  *
//  * Uncomment after implementing and authorizing:
//  * DELETE /api/submissions/:submissionId
//  *
//  * export async function deleteSubmission(
//  *   submissionId: string,
//  * ): Promise<void> {
//  *   await api.delete(`/submissions/${submissionId}`)
//  * }
//  */



import api from './api'

export interface Submission {
  id?: string
  homeworkId: string
  studentId?: string
  student?: {
    id?: string
    fullName?: string
    rollNumber?: string
  } | null
  score?: number | null
  maxScore?: number | null
  submittedAt?: string | null
  feedback?: string | null
}

export interface CreateSubmissionInput {
  homeworkId: string
  studentId: string
  score: number
  maxScore: number
  submittedAt?: string
  feedback?: string
}

export interface UpdateSubmissionInput {
  score?: number
  maxScore?: number
  feedback?: string
}

interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data?: T
}

function unwrap<T>(responseData: T | ApiEnvelope<T>): T {
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'data' in responseData &&
    responseData.data !== undefined
  ) {
    return responseData.data as T
  }

  return responseData as T
}

export async function getSubmissionsByHomework(
  homeworkId: string,
): Promise<Submission[]> {
  const response = await api.get(
    `/submissions/homework/${encodeURIComponent(homeworkId)}`,
  )

  const payload = unwrap<
    Submission[] | { submissions: Submission[] }
  >(response.data)

  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.submissions)) return payload.submissions

  return []
}

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<Submission> {
  const response = await api.post('/submissions', input)

  const payload = unwrap<Submission | { submission: Submission }>(
    response.data,
  )

  return 'submission' in payload ? payload.submission : payload
}

export async function updateSubmission(
  submissionId: string,
  input: UpdateSubmissionInput,
): Promise<Submission> {
  const response = await api.patch(
    `/submissions/${encodeURIComponent(submissionId)}`,
    input,
  )

  const payload = unwrap<Submission | { submission: Submission }>(
    response.data,
  )

  return 'submission' in payload ? payload.submission : payload
}

export async function deleteSubmission(
  submissionId: string,
): Promise<void> {
  await api.delete(
    `/submissions/${encodeURIComponent(submissionId)}`,
  )
}
