
import api from './api'

export interface Classroom {
  id: string
  name: string
  gradeLevel: string
  section?: string | null
  academicYear: string
}

export interface ClassroomAnalytics {
  summary: {
    totalStudents: number
    totalQuizzes: number
    totalHomework: number
    gradedHomeworkCount: number
    averageQuizPercentage: number
    averageHomeworkPercentage: number
    homeworkCompletionRate: number
    studentsNeedingSupport: number
  }
  studentPerformance: Array<{
    studentId: string
    name?: string | null
    fullName: string
    averageQuizPercentage: number
    needsSupport: boolean
  }>
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

function unwrap<T>(responseData: T | ApiResponse<T>): T {
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'success' in responseData &&
    'data' in responseData
  ) {
    return (responseData as ApiResponse<T>).data
  }

  return responseData as T
}

 export async function getClassrooms(): Promise<Classroom[]> {
  const response = await api.get('/classrooms')

  const result = unwrap<
    { classrooms: Classroom[] } | Classroom[]
  >(response.data)

  return Array.isArray(result)
    ? result
    : result.classrooms
}
export async function getClassroomAnalytics(
  classroomId: string
): Promise<ClassroomAnalytics> {
  const response = await api.get(
    `/analytics/classroom/${encodeURIComponent(classroomId)}`
  )

  return unwrap<ClassroomAnalytics>(response.data)
}
