
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import { Role } from '../generated/prisma/client.js'
import { signAccessToken } from '../utils/jwt.js'


interface RegisterInput {
  name: string
  email: string
  password: string
  role?: Role
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase()

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    const error = new Error('An account with this email already exists')
    Object.assign(error, { statusCode: 409 })
    throw error
  }

  const passwordHash = await bcrypt.hash(input.password, 12)

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      // Public registration must not let users assign themselves
      // privileged roles such as ADMIN or TEACHER.
      role: Role.STUDENT,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return user
}


export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  // Use the same message for both cases to avoid revealing
  // whether an email address has an account.
  if (!user) {
    const error = new Error('Invalid email or password')
    Object.assign(error, { statusCode: 401 })
    throw error
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash,
  )

  if (!passwordMatches) {
    const error = new Error('Invalid email or password')
    Object.assign(error, { statusCode: 401 })
    throw error
  }

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  })

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}
