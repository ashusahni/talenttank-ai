'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function UserResponsePage() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [userResponses, setUserResponses] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [showMoreState, setShowMoreState] = useState<Record<string, boolean>>({})

	useEffect(() => {
		const fetchResponses = async () => {
			try {
				const res = await fetch('/api/admin/all-user-responses')
				const data = await res.json()
				setUserResponses(data)
			} catch (error) {
				console.error('Error fetching responses:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchResponses()
	}, [])

	const toggleShowMore = (userId: string) => {
		setShowMoreState(prev => ({
			...prev,
			[userId]: !prev[userId],
		}))
	}

	if (loading) {
		return <p className="text-center py-4">Loading...</p>
	}

	return (
		<div className="py-4">
			<h1 className="text-2xl font-semibold">User Responses</h1>
			<p className="text-sm text-muted-foreground">These are the user responses to the AI-generated questionnaire.</p>

			<div className="flex flex-col gap-6 my-4">
				{userResponses.map(({ user, responses }) => {
					const showAll = showMoreState[user?.id] || false
					const displayedResponses = showAll ? responses : responses.slice(0, 6)

					return (
						<div key={user?.id} className="border-b pb-4">
							<div className="flex items-center gap-4 mb-2">
								<Avatar>
									<AvatarImage src={user?.avatarUrl} />
									<AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{user?.firstName} {user?.lastName}
									</p>
									<p className="text-sm text-muted-foreground">{user?.jobTitle}</p>
									<p className="text-xs text-muted-foreground">{user?.email}</p>
								</div>
							</div>

							<div className="flex gap-4 flex-wrap">
								{/* @ts-expect-error  //ignore */}
								{displayedResponses.map(item => (
									<Card key={item.id} className="max-w-sm w-full">
										<CardHeader>
											<CardTitle>
												<span className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
											</CardTitle>
										</CardHeader>
										<CardContent className="line-clamp-4 text-sm text-muted-foreground">{item.userSummary}</CardContent>
										<CardFooter className="flex flex-col w-full gap-4">
											<div className="w-full">
												<div className="flex justify-between mb-1">
													<span>Predictive Index</span>
													<span>
														{item.averagePredictiveIndex * 20}/{5 * 20}
													</span>
													{/* <span>
														{item.averagePredictiveIndex}/{5}
													</span> */}
												</div>
												<Progress max={100} value={item.averagePredictiveIndex * 20} className="h-2" />
											</div>
											<div className="w-full">
												<div className="flex justify-between mb-1">
													<span>Emotional Intelligence</span>
													<span>
														{item?.averageEmotionalIntelligence * 20}/{5 * 20}
													</span>
													{/* <span>{item?.averageEmotionalIntelligence}/5</span> */}
												</div>
												<Progress max={100} value={item.averageEmotionalIntelligence * 20} className="h-2" />
											</div>
											<Link href={`/admin/report/${user?.id}`} className="text-sm text-blue-500 hover:underline">
												View full report
											</Link>
										</CardFooter>
									</Card>
								))}
							</div>

							{responses.length > 6 && (
								<Button variant="outline" size="sm" className="mt-3" onClick={() => toggleShowMore(user?.id)}>
									{showAll ? 'Show Less' : 'Show More'}
								</Button>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
