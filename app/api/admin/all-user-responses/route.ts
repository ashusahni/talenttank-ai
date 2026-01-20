import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/prisma'

export async function GET() {
	try {
		const allUserResponses = await prisma.aIQuestionnaireAnswers.findMany({ include: { User: true } })

		// Group responses by user ID
		const groupedResponses = allUserResponses.reduce((acc, item) => {
			const userId = item.User?.id
			if (!userId) return acc

			if (!acc[userId]) {
				acc[userId] = {
					user: item.User,
					responses: [],
				}
			}
			acc[userId].responses.push(item)

			return acc
		}, {} as Record<string, { user: (typeof allUserResponses)[0]['User']; responses: typeof allUserResponses }>)

		return NextResponse.json(Object.values(groupedResponses))
	} catch (error) {
		return NextResponse.json({ message: 'Failed to fetch user responses', error }, { status: 500 })
	}
}
