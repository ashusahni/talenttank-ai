import prisma from '@/lib/prisma/prisma'
import AiQuestion from './ai'

export default async function AiQuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const aiQuestionnaire = await prisma.aIQuestionnaire.findUnique({ where: { id: Number(id) }, include: { questions: true } })

	if (!aiQuestionnaire) {
		return (
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 flex items-center justify-center p-4">
					<div className="rounded-full bg-primary/10 p-6">
						<div className="text-center">
							<h1 className="text-2xl font-bold">Questionnaire not found</h1>
							<p className="text-muted-foreground">The questionnaire you are looking for does not exist.</p>
						</div>
					</div>
				</main>
			</div>
		)
	}

	return (
		<div>
			<AiQuestion questions={aiQuestionnaire.questions!} aIquestionnaireId={id} />
		</div>
	)
}
