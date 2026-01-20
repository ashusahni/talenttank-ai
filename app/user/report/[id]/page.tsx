import prisma from '@/lib/prisma/prisma'
import ReportDescription from './report'

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const aiAnalysis = await prisma.aIQuestionnaireAnswers.findUnique({ where: { id: Number(id) } })

	if (!aiAnalysis) {
		return <div className="container mx-auto p-4 text-center">Error loading report.</div>
	}

	return <ReportDescription aiAnalysis={aiAnalysis} assessmentId={id} />
}
