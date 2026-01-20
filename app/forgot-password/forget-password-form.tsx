'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordForm() {
	return (
		<div className="space-y-6">
			<form className="space-y-6" action="#" method="POST">
				<div>
					<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
						Email address
					</label>
					<Input type="email" id="email" placeholder="Email" />
				</div>
				<div className="flex items-center justify-between">
					<Button className="w-full">Send reset link</Button>
				</div>
			</form>
		</div>
	)
}
