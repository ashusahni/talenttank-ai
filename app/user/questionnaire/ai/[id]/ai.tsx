'use client'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { AIQuestion } from '@prisma/client'
import { cn } from '@/lib/utils'

// Timer duration in seconds (10 minutes = 600 seconds)
const TIMER_DURATION = 600

export default function AiQuestion({
	questions,
	aIquestionnaireId,
}: {
	questions: AIQuestion[]
	aIquestionnaireId: string
}) {
	const [hasAgreed, setHasAgreed] = useState(false)
	const [currentStep, setCurrentStep] = useState(0)
	const [answers, setAnswers] = useState<Record<number, string>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION)
	const [showTimeWarning, setShowTimeWarning] = useState(false)
	const [analysisResponse, setAnalysisResponse] = useState(null)

	const totalQuestions = questions.length
	const currentQuestion = questions[currentStep]
	const progress = (currentStep / totalQuestions) * 100

	// Format time remaining as MM:SS
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	// Get time color based on remaining time
	const getTimeColor = () => {
		if (timeRemaining <= 60) return 'text-destructive'
		if (timeRemaining <= 180) return 'text-orange-500'
		return 'text-muted-foreground'
	}

	// Submit form function - can be called manually or by timer
	const submitForm = useCallback(
		async (isAutoSubmit = false) => {
			if (isSubmitting) return

			// Check if all questions are answered
			const unansweredQuestions = questions.filter(q => !answers[q.id])

			if (isAutoSubmit && unansweredQuestions.length > 0) {
				// For auto-submit, we'll submit whatever is completed

				toast.warning(`Time's up!`, {
					description: `Submitting your questionnaire with ${
						totalQuestions - unansweredQuestions.length
					} of ${totalQuestions} questions answered.`,
				})
			}

			// Format the answers to match the expected API structure
			const formattedAnswers = questions.map(question => ({
				aiQuestionId: question.id,
				answer: answers[question.id] || '',
				category: question.category,
				placeholder: question.placeholder,
				options: question.options,
				type: question.type,
				question: question.question,
			}))

			setIsSubmitting(true)
			setError(null)

			try {
				// Replace with your actual API endpoint
				const response = await fetch('/api/submit-ai-questionnaire-answer', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						answers: formattedAnswers,
						aiQuestionnaireId: aIquestionnaireId,
						autoSubmitted: isAutoSubmit,
					}),
				})

				if (!response.ok) {
					throw new Error('Failed to submit questionnaire')
				}

				setAnalysisResponse(await response.json())

				setSuccess(true)
				setIsSubmitting(false)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An unknown error occurred')
				setIsSubmitting(false)
			}
		},
		[aIquestionnaireId, answers, isSubmitting, questions, totalQuestions]
	)

	// Timer effect
	useEffect(() => {
		if (!hasAgreed || success || timeRemaining <= 0 || isSubmitting) return

		const timer = setInterval(() => {
			setTimeRemaining(prev => {
				if (prev <= 1) {
					clearInterval(timer)
					submitForm(true)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [timeRemaining, success, submitForm, hasAgreed, isSubmitting])

	// Warning dialog effect
	useEffect(() => {
		if (timeRemaining === 180) {
			// 3 minutes remaining
			toast('3 minutes remaining', {
				description: 'Please try to complete the questionnaire soon.',
			})
		} else if (timeRemaining === 60) {
			// 1 minute remaining
			setShowTimeWarning(true)
			toast.warning('1 minute remaining!', {
				description: 'The form will be automatically submitted when time expires.',
			})
		}
	}, [timeRemaining])

	const handleNextQuestion = () => {
		if (currentStep < totalQuestions - 1) {
			setCurrentStep(currentStep + 1)
			window.scrollTo(0, 0)
		}
	}

	const handlePreviousQuestion = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
			window.scrollTo(0, 0)
		}
	}

	const handleAnswerChange = (value: string) => {
		setAnswers({
			...answers,
			[currentQuestion.id]: value,
		})
	}

	const isCurrentQuestionAnswered = () => {
		return !!answers[currentQuestion.id]
	}

	const isLastQuestion = currentStep === totalQuestions - 1

	const handleSubmit = () => {
		console.log(answers)

		const newObj: Array<AIQuestion & { answer: string }> = []

		questions.forEach(ques => {
			if (answers[ques.id]) {
				const quesWithAns: AIQuestion & { answer: string } = { ...ques, answer: answers[ques.id] }
				newObj.push(quesWithAns)
				console.log(quesWithAns)
			}
		})
		console.log(newObj)

		submitForm(false)
	}

	// Render the success state
	if (success || isSubmitting) {
		return (
			<div className="flex min-h-screen flex-col">
				<main className="flex-1 flex items-center justify-center p-4">
					<Card className="w-full max-w-2xl">
						<CardHeader>
							<CardTitle className="text-2xl text-center">Thank You!</CardTitle>
							<CardDescription className="text-center">Your responses have been submitted successfully.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center space-y-6 pt-6">
							<div className="rounded-full bg-primary/10 p-6">
								<CheckCircle className="h-12 w-12 text-primary" />
							</div>
							<p className="text-center text-muted-foreground">
								We&apos;ve analyzed your responses and created personalized report tailored to your expertise and development style.
								You can view the report below.
							</p>
						</CardContent>
						<CardFooter className="flex justify-center">
							{success ? (
								<Button asChild>
									{/* @ts-expect-error  //ignore */}
									<Link href={`/user/report/${analysisResponse.savedAnswers.id}`}>View Report</Link>
								</Button>
							) : (
								<div className="flex justify-center items-center flex-col">
									<Button disabled>
										Please Wait <Loader2 className="h-4 w-4 animate-spin" />
									</Button>
									<p className="text-muted-foreground text-sm">Kindly wait while we are analyzing your answers.</p>
								</div>
							)}
						</CardFooter>
					</Card>
				</main>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col">
			<Dialog open={!hasAgreed}>
				<DialogContent showCross={false}>
					<DialogHeader>
						<DialogTitle>Are you ready to attempt the questionnaire?</DialogTitle>
						<DialogDescription>
							<span className="block w-full">
								Click &quot;Yes&quot; to start. The timer will begin once you proceed. <br />
								<span>Time remaining: {formatTime(timeRemaining)}</span>
							</span>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Link href={'/'} className={cn(buttonVariants({ variant: 'destructive' }))} onClick={() => setHasAgreed(true)}>
							Go, Back
						</Link>
						<Button onClick={() => setHasAgreed(true)}>Yes, Start</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
				<DialogContent showCross={false}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-destructive" />
							Time is running out!
						</DialogTitle>
						<DialogDescription>
							You have less than 1 minute remaining to complete the questionnaire. The form will be automatically submitted when the
							timer reaches zero.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setShowTimeWarning(false)}>Continue</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<main className="flex-1 mx-auto mt-10 container max-w-4xl py-8 px-4">
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						<h1 className="text-2xl font-bold">Professional Profile Questionnaire</h1>
						<div className={`flex items-center gap-1 ${getTimeColor()}`}>
							<Clock className="h-5 w-5" />
							<span className="text-sm font-medium">Time remaining: {formatTime(timeRemaining)}</span>
						</div>
					</div>
					<p className="text-muted-foreground">
						Help us understand your expertise and development style to create personalized contests.
					</p>
					<Progress value={progress} className="h-2 mt-4" />
				</div>

				{error && (
					<Alert variant="destructive" className="mb-6">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Card className="mb-6">
					<CardHeader>
						<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-2">
							{currentQuestion.category === 'emotional_intelligence' ? 'emotional intelligence' : 'predictive index'}
						</div>
						<CardTitle onCopy={e => e.preventDefault()}>{currentQuestion.question}</CardTitle>
					</CardHeader>
					<CardContent>
						{currentQuestion.type === 'multiple_choice' && (
							<RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={handleAnswerChange} className="space-y-3">
								{currentQuestion.options?.map((option, index) => (
									<div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
										<RadioGroupItem value={option} id={`option-${index}`} />
										<Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
											{option}
										</Label>
									</div>
								))}
							</RadioGroup>
						)}

						{currentQuestion.type === 'input_text' && (
							<Textarea
								value={answers[currentQuestion.id] || ''}
								onChange={e => handleAnswerChange(e.target.value)}
								placeholder={currentQuestion.placeholder || ''}
								className="min-h-[150px]"
								maxLength={60}
								onCopy={e => e.preventDefault()}
								onPaste={e => e.preventDefault()}
							/>
						)}
						{currentQuestion.type === 'input_text' && (
							<p className="text-xs text-muted-foreground mt-1">{answers[currentQuestion.id]?.length || 0}/60</p>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="outline" onClick={handlePreviousQuestion} disabled={currentStep === 0}>
							<ArrowLeft className="mr-2 h-4 w-4" /> Previous
						</Button>

						{!isLastQuestion ? (
							<Button onClick={handleNextQuestion} disabled={!isCurrentQuestionAnswered() || isSubmitting}>
								Next <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button onClick={handleSubmit} disabled={!isCurrentQuestionAnswered() || isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
									</>
								) : (
									'Submit'
								)}
							</Button>
						)}
					</CardFooter>
				</Card>

				<div className="flex justify-between text-sm text-muted-foreground">
					<span>
						{currentQuestion.category === 'emotional_intelligence'
							? 'Questions about your emotional intelligence'
							: 'Questions about your predictive index'}
					</span>
					<span>
						{Object.keys(answers).length} of {totalQuestions} answered
					</span>
				</div>
			</main>
		</div>
	)
}
