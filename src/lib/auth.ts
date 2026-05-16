import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only'

export interface AuthUser {
  id: string
  email: string
  role: string
  name: string
}

export async function signToken(payload: AuthUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch (error) {
    return null
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  return verifyToken(token)
}
