import { type NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

type uploadResponse = { secure_url: string } | undefined

// Define schema for validation
const updateProfileSchema = z.object({
	id: z.string(),
	firstName: z.string().min(2),
	lastName: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8).optional(),
	countryCode: z.string().min(1),
	phoneNumber: z.string().min(5),
	dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
		message: 'Invalid date format',
	}),
	jobTitle: z.string().min(2),
	company: z.string().min(2),
	yearsOfExperience: z.string().refine(val => !isNaN(Number(val)), {
		message: 'Years of experience must be a number',
	}),
	linkedinUrl: z.string().url().optional().or(z.literal('')),
	githubUrl: z.string().url().optional().or(z.literal('')),
	twitterUrl: z.string().url().optional().or(z.literal('')),
	// Profile picture will be handled separately
})

export async function PUT(request: NextRequest) {
	try {
		// Check if user is authenticated
		const session = await auth()
		if (!session?.user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		const formData = await request.formData()

		// Extract and validate form data
		const data = {
			id: formData.get('id') as string,
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			email: formData.get('email') as string,
			password: (formData.get('password') as string) || undefined,
			countryCode: formData.get('countryCode') as string,
			phoneNumber: formData.get('phoneNumber') as string,
			dateOfBirth: formData.get('dateOfBirth') as string,
			jobTitle: formData.get('jobTitle') as string,
			company: formData.get('company') as string,
			yearsOfExperience: formData.get('yearsOfExperience') as string,
			linkedinUrl: (formData.get('linkedinUrl') as string) || '',
			githubUrl: (formData.get('githubUrl') as string) || '',
			twitterUrl: (formData.get('twitterUrl') as string) || '',
		}

		// Validate data
		const validatedData = updateProfileSchema.parse(data)

		// Verify user is updating their own profile
		if (validatedData.id !== session.user.id) {
			return NextResponse.json({ message: 'You can only update your own profile' }, { status: 403 })
		}

		// Check if email is already taken by another user
		if (validatedData.email !== session.user.email) {
			const existingUser = await prisma.user.findUnique({
				where: { email: validatedData.email },
			})

			if (existingUser && existingUser.id !== validatedData.id) {
				return NextResponse.json({ message: 'Email is already in use by another account' }, { status: 400 })
			}
		}

		// Handle profile picture if provided
		const profilePicture = formData.get('profilePicture') as File | null
		let profilePictureUrl: string | undefined = undefined

		if (profilePicture) {
			const arrayBuffer = await profilePicture.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const uploadResponse: uploadResponse = await new Promise((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: 'image' }, (error, result) => {
						if (error) reject(error)
						else resolve(result)
					})
					.end(buffer)
			})

			profilePictureUrl = uploadResponse?.secure_url
		}

		// Prepare update data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const updateData: any = {
			firstName: validatedData.firstName,
			lastName: validatedData.lastName,
			email: validatedData.email,
			countryCode: validatedData.countryCode,
			phoneNumber: validatedData.phoneNumber,
			dateOfBirth: new Date(validatedData.dateOfBirth),
			jobTitle: validatedData.jobTitle,
			company: validatedData.company,
			yearsOfExperience: Number.parseInt(validatedData.yearsOfExperience),
			linkedinUrl: validatedData.linkedinUrl || null,
			githubUrl: validatedData.githubUrl || null,
			twitterUrl: validatedData.twitterUrl || null,
		}

		// Only update password if provided
		if (validatedData.password) {
			updateData.password = await bcrypt.hash(validatedData.password, 10)
		}

		// Only update profile picture if provided
		if (profilePictureUrl) {
			updateData.avatarUrl = profilePictureUrl
		}

		// Update user in database
		const user = await prisma.user.update({
			where: { id: validatedData.id },
			data: updateData,
		})

		// Return success response without exposing sensitive data
		return NextResponse.json(
			{
				message: 'Profile updated successfully',
				userId: user.id,
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Profile update error:', error)

		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 })
		}

		return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
	}
}
