import type React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth()
	const user = session?.user

	if (!user) {
		redirect('/register')
	} else if (user.role !== 'ADMIN') {
		redirect('/user')
	}

	return (
		<div className="flex min-h-screen flex-col py-4">
			<main className="flex-1 container mx-auto">{children}</main>
		</div>
	)
}
