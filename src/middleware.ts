import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Vérification optimiste basée sur le cookie de session — rapide, sans appel
// DB ni API (compatible Edge runtime). ⚠️ Ceci ne VALIDE pas la session :
// n'importe qui peut forger un cookie. La vraie protection se fait dans chaque
// page/route serveur via `auth.api.getSession({ headers: await headers() })`.
export function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    // À ajuster aux routes réellement protégées de Balise.
    matcher: ['/dashboard/:path*'],
}
