'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/custom-calendar'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CountryDropdown } from './ui/country-dropdown'

const formSchema = z.object({
	firstName: z.string().min(2, {
		message: 'First name must be at least 2 characters.',
	}),
	lastName: z.string().min(2, {
		message: 'Last name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters.',
		})
		.optional(),
	countryCode: z.string().min(1, {
		message: 'Country code is required.',
	}),
	phoneNumber: z.string().min(5, {
		message: 'Phone number must be at least 5 characters.',
	}),
	dateOfBirth: z.date({
		required_error: 'Date of birth is required.',
	}),
	jobTitle: z.string().min(2, {
		message: 'Professional Occupation must be at least 2 characters.',
	}),
	company: z.string().min(2, {
		message: 'Company name must be at least 2 characters.',
	}),
	yearsOfExperience: z.string().refine(val => !isNaN(Number(val)), {
		message: 'Years of experience must be a number.',
	}),
	linkedinUrl: z
		.string()
		.url({
			message: 'Please enter a valid LinkedIn URL.',
		})
		.optional()
		.or(z.literal('')),
	githubUrl: z
		.string()
		.url({
			message: 'Please enter a valid GitHub URL or Resume link.',
		})
		.optional()
		.or(z.literal('')),
	profilePicture: z.instanceof(File).optional(),
})

type UserData = {
	id: string
	firstName: string
	lastName: string
	email: string
	countryCode: string
	phoneNumber: string
	dateOfBirth: Date
	jobTitle: string | null
	company: string | null
	yearsOfExperience: number | null
	linkedinUrl: string | null
	githubUrl: string | null
	avatarUrl: string | null
}

export function ProfileEditForm({ user }: { user: UserData }) {
	console.log(user)
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [profilePicture, setProfilePicture] = useState<string | null>(user.avatarUrl)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			countryCode: user.countryCode,
			phoneNumber: user.phoneNumber,
			dateOfBirth: user.dateOfBirth,
			jobTitle: user.jobTitle || '',
			company: user.company || '',
			yearsOfExperience: String(user.yearsOfExperience) || '',
			linkedinUrl: user.linkedinUrl || '',
			githubUrl: user.githubUrl || '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true)

		try {
			const formData = new FormData()

			// Add all form fields to FormData
			Object.entries(values).forEach(([key, value]) => {
				if (key === 'dateOfBirth') {
					// @ts-expect-error //ignore
					formData.append(key, value.toISOString())
				} else if (key === 'profilePicture') {
					// @ts-expect-error //ignore
					formData.append(key, value)
				} else if (key === 'password' && value === '') {
					// Skip empty password (no change)
				} else if (value !== undefined && value !== null) {
					formData.append(key, String(value))
				}
			})

			// Add user ID
			formData.append('id', user.id)

			const response = await fetch('/api/profile/update', {
				method: 'PUT',
				body: formData,
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Profile update failed')
			}

			toast('Profile updated', {
				description: 'Your profile has been updated successfully.',
			})

			router.push('/')
			router.refresh()
		} catch (error) {
			console.error('Profile update error:', error)
			toast('Update failed', {
				// description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
				description: 'Something went wrong. Please try again.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			form.setValue('profilePicture', file)

			// Create a preview
			const reader = new FileReader()
			reader.onload = () => {
				setProfilePicture(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="flex justify-center mb-6">
					<div className="relative">
						<Avatar className="h-24 w-24">
							<AvatarImage src={profilePicture || ''} alt="Profile picture" />
							<AvatarFallback>
								{form.watch('firstName')?.[0]}
								{form.watch('lastName')?.[0]}
							</AvatarFallback>
						</Avatar>
						<Input type="file" id="profilePicture" accept="image/*" className="sr-only" onChange={handleFileChange} />
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="absolute bottom-0 right-0 rounded-full"
							onClick={() => document.getElementById('profilePicture')?.click()}>
							Change
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input placeholder="John" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input placeholder="Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="john.doe@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									disabled
									type="password"
									placeholder="Leave blank to keep current password"
									{...field}
									value={field.value || ''}
								/>
							</FormControl>
							<FormDescription>Leave blank to keep your current password, or enter a new one (min. 8 characters).</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="countryCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Country</FormLabel>
								<CountryDropdown
									placeholder="Country"
									defaultValue={field.value}
									onChange={country => {
										field.onChange(country.countryCallingCodes[0])
									}}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input placeholder="5551234567" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="dateOfBirth"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date of Birth</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outline'}
											className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
											{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={date => date > new Date() || date < new Date('1900-01-01')}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="jobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Occupation</FormLabel>
								<FormControl>
									<Input placeholder="Student" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company</FormLabel>
								<FormControl>
									<Input placeholder="Acme Inc." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="yearsOfExperience"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Years of Experience</FormLabel>
							<FormControl>
								<Input type="number" placeholder="5" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="linkedinUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>LinkedIn Profile URL</FormLabel>
							<FormControl>
								<Input placeholder="https://linkedin.com/in/username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="githubUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>GitHub / Resume / Portfolio Link</FormLabel>
							<FormControl>
								<Input placeholder="https://github.com/username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-4">
					<Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
						Cancel
					</Button>
					<Button type="submit" className="flex-1" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Updating...
							</>
						) : (
							'Save Changes'
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
}
