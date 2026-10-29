 
import api from './api'

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export async function registerUser(
  input: RegisterInput
): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    input
  )

  return response.data.data
}

export async function loginUser(
  input: LoginInput
): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    input
  )

  return response.data.data
}
