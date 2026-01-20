import prisma from '@/lib/prisma/prisma'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
	}

	try {
		const userDetails = await prisma.user.findUnique({ where: { id: user.id! } })
		const totalCredits = userDetails?.totalCredits ? userDetails.totalCredits : 0
		const usedCredits = userDetails?.usedCredits ? userDetails.usedCredits : 0

		return NextResponse.json({
			message: 'Available credits',
			availableCredits: totalCredits - usedCredits,
		})
	} catch (error) {
		return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
	}
}
