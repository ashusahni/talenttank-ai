import ReportDescription from '@/app/user/report/[id]/report'
import prisma from '@/lib/prisma/prisma'

export default async function ParticularUserResponsePage({ params }: { params: Promise<{ userId: string }> }) {
	const { userId } = await params
	const userAiAnswers = await prisma.aIQuestionnaireAnswers.findMany({ where: { userId: userId } })

	return (
		<div>
			<ReportDescription aiAnalysis={userAiAnswers[0]} assessmentId={userAiAnswers[0].id.toString()} />
		</div>
	)
}
