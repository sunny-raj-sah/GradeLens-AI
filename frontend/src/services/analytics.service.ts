 
import api from './api'

export interface AnalyticsSummary {
  totalStudents: number
  totalQuizzes: number
  totalHomework: number
  gradedHomeworkCount: number
  averageQuizPercentage: number
  averageHomeworkPercentage: number
  homeworkCompletionRate: number
  studentsNeedingSupport: number
}

export interface StudentPerformance {
  studentId: string
  name: string
  rollNumber: string
  averageQuizPercentage?: number
  averageHomeworkPercentage?: number
  homeworkCompletionRate?: number
}

export interface ClassroomAnalytics {
  summary: AnalyticsSummary
  studentPerformance: StudentPerformance[]
}

export interface StudentHomeworkSubmission {
  id: string
  score: number | null
  maxScore: number | null
  feedback: string | null
  submittedAt: string
  homework: {
    id: string
    title: string
  }
}

export interface StudentQuizResult {
  id: string
  quizName: string
  score: number
  maxScore: number
  takenAt: string
    needsSupport?: boolean | null
}

export interface StudentDetails {
  id: string
  fullName: string
  rollNumber: string
  email: string | null
  classroomId: string
  
  createdAt: string
  updatedAt: string
  classroom: {
    id: string
    name: string
    gradeLevel: string | number
    section: string | null
    academicYear: string | null
    teacherId: string
    teacher: {
      id: string
      name: string
      email: string
    } | null
  }
  homeworkSubmissions: StudentHomeworkSubmission[]
  quizResults: StudentQuizResult[]
}

/**
 * Unwraps the common API response:
 * { success: true, data: ... }
 *
 * Also supports responses that return the payload directly.
 */
function unwrapData(responseData: unknown): unknown {
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'data' in responseData
  ) {
    return (responseData as { data: unknown }).data
  }

  return responseData
}

function extractObject<T>(payload: unknown, key: string): T {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    key in payload
  ) {
    return (payload as Record<string, unknown>)[key] as T
  }

  return payload as T
}

/**
 * GET /analytics/classroom/:classroomId
 *
 * Fetches summary analytics and student performance for a classroom.
 */
export async function getClassroomAnalytics(
  classroomId: string,
): Promise<ClassroomAnalytics> {
  const response = await api.get(
    `/analytics/classroom/${encodeURIComponent(classroomId)}`,
  )

  const payload = unwrapData(response.data)

  // Supports both { analytics: {...} } and direct analytics payloads.
  const analytics = extractObject<ClassroomAnalytics>(
    payload,
    'analytics',
  )

  if (
    !analytics ||
    typeof analytics !== 'object' ||
    !analytics.summary
  ) {
    throw new Error(
      'The server returned invalid classroom analytics.',
    )
  }

  return {
    summary: analytics.summary,
    studentPerformance: Array.isArray(
      analytics.studentPerformance,
    )
      ? analytics.studentPerformance
      : [],
  }
}

/**
 * GET /students/:studentId
 *
 * Returns the details permitted for the authenticated user.
 * Authorization must be enforced by the backend controller.
 */
export async function getStudentDetails(
  studentId: string,
): Promise<StudentDetails> {
  if (!studentId.trim()) {
    throw new Error('A student ID is required.')
  }

  const response = await api.get(
    `/students/${encodeURIComponent(studentId)}`,
  )

  const payload = unwrapData(response.data)
  const student = extractObject<StudentDetails>(
    payload,
    'student',
  )

  if (
    !student ||
    typeof student !== 'object' ||
    typeof student.id !== 'string' ||
    !Array.isArray(student.homeworkSubmissions) ||
    !Array.isArray(student.quizResults)
  ) {
    throw new Error(
      'The server returned invalid student details.',
    )
  }

  return student
}
