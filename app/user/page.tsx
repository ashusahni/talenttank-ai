import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// This would normally be fetched from the database
const questionnaires = [
	{
		id: 1,
		title: 'Sample Questionnaire',
		description: 'This is a sample questionnaire',
		totalQuestions: 5,
	},
]

export default function UserDashboard() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Available Questionnaires</h2>
					<p className="text-muted-foreground">Select a questionnaire to complete</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{questionnaires.length > 0 ? (
						questionnaires.map(questionnaire => (
							<Card key={questionnaire.id}>
								<CardHeader>
									<CardTitle>{questionnaire.title}</CardTitle>
									<CardDescription>{questionnaire.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm mb-4">{questionnaire.totalQuestions} questions</p>
									<Button asChild className="w-full">
										<Link href={`/user/questionnaires/${questionnaire.id}`}>Start Questionnaire</Link>
									</Button>
								</CardContent>
							</Card>
						))
					) : (
						<div className="col-span-full text-center py-10 border rounded-lg">
							<p className="text-muted-foreground">No questionnaires available at the moment</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
