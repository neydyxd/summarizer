import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value

  // Проверка админского доступа
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const payloadUser = JSON.parse(atob(token.split('.')[1]))

      const API_URL =
        process.env.NODE_ENV === 'production' ? process.env.URL_PROD : process.env.URL_DEV

      const response = await fetch(`${API_URL}/api/users/${payloadUser.id}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()

      if (!userData.isAdmin) {
        return NextResponse.redirect(new URL('/not-found', request.url))
      }
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Если пользователь не авторизован и пытается получить доступ к защищенным роутам
  if (!token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Если пользователь авторизован и пытается получить доступ к страницам авторизации
  if (
    token &&
    (request.nextUrl.pathname === '/reset-password' ||
      request.nextUrl.pathname === '/forgot' ||
      request.nextUrl.pathname === '/login')
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register', '/admin/:path*'],
}
