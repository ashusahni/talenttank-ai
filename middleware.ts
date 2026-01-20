// C:\PERSONAL FILES\SANDBOX\WEB PROJECTS\TALENTTANK-AI\middleware.ts
// --- CLEANED: Removed references to the proxy route ---

import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)
export const runtime = "nodejs";

export default auth(async function middleware(request) {
	const allowedPaths = [
		'/',
		'/login',
		'/register',
		'/api/razorpay/webhook',
		'/forgot-password',
		'/about-us',
		'/contact',
		'/toc',
		'/privacy-policy',
		'/refund-policy',
	]

	const headers = new Headers(request.headers)
	headers.set('x-current-origin', request.nextUrl.origin)

	if (allowedPaths.includes(request.nextUrl.pathname)) {
		return NextResponse.next({ headers })
	}

	if (!request.auth) {
		const requestedUrl = request.nextUrl.pathname
		const urls = requestedUrl.split('/')
		if (urls[1] === 'seller') {
			const newUrl = new URL('/seller/sign-in', request.nextUrl.origin)
			return NextResponse.redirect(newUrl, { headers })
		}

		const newUrl = new URL('/api/auth/signin', request.nextUrl.origin)
		return NextResponse.redirect(newUrl, { headers })
	}

	return NextResponse.next({ headers })
})

export const config = {
	matcher: [
		'/((?!api/auth|auth|images|assets|_next/static|auth/*|_next/image|favicon.ico|api/cloudinary/image-upload|^/$).+)',
		'/',
	],
}