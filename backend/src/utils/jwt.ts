 
import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return secret
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '1d',
  })
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, getJwtSecret())

  if (
    typeof decoded === 'string' ||
    typeof decoded.userId !== 'string' ||
    !['ADMIN', 'TEACHER', 'STUDENT'].includes(decoded.role as string)
  ) {
    throw new Error('Invalid authentication token')
  }

  return {
    userId: decoded.userId,
    role: decoded.role as JwtPayload['role'],
  }
}
