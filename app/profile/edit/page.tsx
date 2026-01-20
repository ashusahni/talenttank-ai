import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/components/profile-edit-form'
import prisma from '@/lib/prisma/prisma'

export default async function ProfileEditPage() {
	const session = await auth()
	console.log(session)

	if (!session?.user) {
		redirect('/register')
	}

	// Fetch the user's data from the database
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			avatarUrl: true,
			countryCode: true,
			phoneNumber: true,
			dateOfBirth: true,
			jobTitle: true,
			company: true,
			yearsOfExperience: true,
			linkedinUrl: true,
			githubUrl: true,
			twitterUrl: true,
		},
	})

	if (!user) {
		redirect('/register')
	}

	return (
		<div className="container flex min-h-screen flex-col items-center justify-center py-10 mx-auto">
			<div className="mx-auto w-full max-w-3xl space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Edit Profile</h1>
					<p className="text-gray-500 dark:text-gray-400">Update your profile information</p>
				</div>
				<ProfileEditForm user={user} />
			</div>
		</div>
	)
}
