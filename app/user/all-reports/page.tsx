import prisma from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/auth'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

export default async function ReportPage() {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return <div className="container mx-auto p-4 text-center">Error loading report.</div>
	}

	const aiAnalysis = await prisma.aIQuestionnaireAnswers.findMany({ where: { userId: user.id } })
	console.log(aiAnalysis)

	if (aiAnalysis.length === 0) {
		return <div className="container mx-auto p-4 text-center">No reports found.</div>
	}

	return (
		<div className="container mx-auto p-4 flex gap-4 flex-wrap">
			{aiAnalysis.map(aiAnalysis => (
				<Link key={aiAnalysis.id} href={`/user/report/${aiAnalysis.id}`} className="w-full max-w-sm">
					<Card key={aiAnalysis.id}>
						<CardHeader>
							<CardTitle>Email:</CardTitle>
							<CardDescription>{user.email}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="flex justify-between mb-1">
									<span>Predictive Index</span>
									<span>{aiAnalysis?.averagePredictiveIndex * 20}/100</span>
								</div>
								<Progress max={100} value={aiAnalysis.averagePredictiveIndex * 20} className="h-2" />
							</div>
							<div>
								<div className="flex justify-between mb-1">
									<span>Emotional Intelligence</span>
									<span>
										{aiAnalysis?.averageEmotionalIntelligence * 20}/{5 * 20}
									</span>
								</div>
								<Progress max={100} value={aiAnalysis.averageEmotionalIntelligence * 20} className="h-2" />
							</div>
						</CardContent>
						<CardFooter>
							<span className="block w-full text-sm text-muted-foreground">
								{aiAnalysis.createdAt ? new Date(aiAnalysis.createdAt).toLocaleDateString() : 'Not Available'}
							</span>
						</CardFooter>
					</Card>
				</Link>
			))}
		</div>
	)
}
