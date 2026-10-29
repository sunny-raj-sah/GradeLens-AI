 
import api from './api'

export interface Student {
  id: string
  fullName: string
  rollNumber: string
  email?: string | null
  classroomId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateStudentInput {
  fullName: string
  rollNumber: string
  classroomId: string
  email?: string
}

export interface UpdateStudentInput {
  fullName?: string
  rollNumber?: string
  email?: string | null
}

export interface StudentDetails extends Student {
  classroom: {
    id: string
    name: string
    gradeLevel: string
    section: string
    academicYear: string
    teacherId: string
    teacher: {
      id: string
      name: string
      email: string
    }
  }
  homeworkSubmissions: {
    id: string
    score: number | null
    maxScore: number
    feedback: string | null
    submittedAt: string
    homework: {
      id: string
      title: string
    }
  }[]
  quizResults: {
    id: string
    quizName: string
    score: number
    maxScore: number
    takenAt: string
  }[]
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

export async function getStudentsByClassroom(
  classroomId: string,
): Promise<Student[]> {
  const response = await api.get(
    `/students/classroom/${encodeURIComponent(classroomId)}`,
  )

  const result = unwrap<
    { students: Student[] } | Student[]
  >(response.data)

  return Array.isArray(result) ? result : result.students
}

export async function createStudent(
  input: CreateStudentInput,
): Promise<Student> {
  const response = await api.post('/students', {
    fullName: input.fullName.trim(),
    rollNumber: input.rollNumber.trim(),
    classroomId: input.classroomId,
    ...(input.email?.trim()
      ? { email: input.email.trim() }
      : {}),
  })

  const result = unwrap<
    Student | { student: Student }
  >(response.data)

  return 'student' in result ? result.student : result
}

export async function getStudentById(
  studentId: string,
): Promise<StudentDetails> {
  const response = await api.get(
    `/students/${encodeURIComponent(studentId)}`,
  )

  const result = unwrap<
    StudentDetails | { student: StudentDetails }
  >(response.data)

  return 'student' in result ? result.student : result
}

export async function updateStudent(
  studentId: string,
  input: UpdateStudentInput,
): Promise<Student> {
  const response = await api.patch(
    `/students/${encodeURIComponent(studentId)}`,
    {
      ...(input.fullName !== undefined
        ? { fullName: input.fullName.trim() }
        : {}),
      ...(input.rollNumber !== undefined
        ? { rollNumber: input.rollNumber.trim() }
        : {}),
      ...(input.email !== undefined
        ? {
            email: input.email?.trim()
              ? input.email.trim()
              : null,
          }
        : {}),
    },
  )

  const result = unwrap<
    Student | { student: Student }
  >(response.data)

  return 'student' in result ? result.student : result
}

export async function deleteStudent(
  studentId: string,
): Promise<{ studentId: string }> {
  const response = await api.delete(
    `/students/${encodeURIComponent(studentId)}`,
  )

  return unwrap<{ studentId: string }>(response.data)
}
