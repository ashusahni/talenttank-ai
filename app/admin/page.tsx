import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import prisma from '@/lib/prisma/prisma'

export default async function AdminDashboard() {
	const responses = (await prisma.aIQuestionnaireAnswers?.findMany()) || []
	const allUsers = (await prisma.user?.findMany()) || []

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allUsers.length}</div>
						<p className="text-xs text-muted-foreground">Total number of registered users</p>
						<Button asChild className="w-full mt-4" variant="outline">
							<Link href="/admin/user/all">View All Users</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">User Responses</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{responses.length}</div>
						<p className="text-xs text-muted-foreground">View user responses to questionnaires</p>
						<Button asChild className="w-full mt-4" variant="outline">
							<Link href="/admin/report">View All Responses</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
