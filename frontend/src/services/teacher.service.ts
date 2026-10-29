
import api from './api'

export interface TeacherClassroom {
  id: string
  name: string
  gradeLevel: string
  section?: string | null
  academicYear: string
  _count?: {
    students: number
    homeworks: number
  }
}

export interface Teacher {
  id: string
  name: string
  email: string
  role: 'TEACHER' | string
  createdAt?: string
  updatedAt?: string
  taughtClasses?: TeacherClassroom[]
}

export interface CreateTeacherInput {
  name: string
  email: string
  password: string
}

export interface UpdateTeacherInput {
  name?: string
  email?: string
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

export async function getTeachers(): Promise<Teacher[]> {
  const response = await api.get('/teachers')
  const result = unwrap<{ teachers: Teacher[] } | Teacher[]>(
    response.data,
  )

  return Array.isArray(result) ? result : result.teachers
}

export async function getTeacherById(
  teacherId: string,
): Promise<Teacher> {
  const response = await api.get(`/teachers/${teacherId}`)
  const result = unwrap<Teacher | { teacher: Teacher }>(
    response.data,
  )

  return 'teacher' in result ? result.teacher : result
}

export async function createTeacher(
  input: CreateTeacherInput,
): Promise<Teacher> {
  const response = await api.post('/teachers', {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
  })

  const result = unwrap<Teacher | { teacher: Teacher }>(
    response.data,
  )

  return 'teacher' in result ? result.teacher : result
}

export async function updateTeacher(
  teacherId: string,
  input: UpdateTeacherInput,
): Promise<Teacher> {
  const response = await api.patch(`/teachers/${teacherId}`, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.email !== undefined
      ? { email: input.email.trim().toLowerCase() }
      : {}),
  })

  const result = unwrap<Teacher | { teacher: Teacher }>(
    response.data,
  )

  return 'teacher' in result ? result.teacher : result
}

export async function deleteTeacher(
  teacherId: string,
): Promise<Teacher> {
  const response = await api.delete(`/teachers/${teacherId}`)
  const result = unwrap<Teacher | { teacher: Teacher }>(
    response.data,
  )

  return 'teacher' in result ? result.teacher : result
}
