import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/signup']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/team/:path*',
    '/api/projects/:path*',
    '/api/tasks/:path*',
    '/login',
    '/signup'
  ],
}
