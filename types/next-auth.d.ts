import NextAuth, { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			firstName: string
			lastName: string
			email: string
			role: 'ADMIN' | 'USER'
			image?: string | null
		} & DefaultSession['user']
	}
	interface User {
		firstName: string
		lastName: string
		email: string
		role: 'ADMIN' | 'USER'
		image?: string | null
	}
}
