import { RegistrationForm } from '@/components/registration-form'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function RegisterPage() {
	const session = await auth()
	const user = session?.user

	if (user) {
		redirect('/')
	}

	return (
		<div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-10">
			<div className="mx-auto w-full max-w-3xl space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Create an account</h1>
					<p className="text-gray-500 dark:text-gray-400">Fill in the form below to create your account</p>
				</div>
				<RegistrationForm />
				<Link href={'/login'} className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
					Login
				</Link>
			</div>
		</div>
	)
}
