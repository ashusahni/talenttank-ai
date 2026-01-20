'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Question } from '@/types/questions'
import { useRouter } from 'next/navigation'

// The questionnaire data
const questionnaireData: Question[] = [
	{
		id: 1,
		question: 'Which of the following best describes your current role?',
		type: 'multiple_choice',
		options: [
			'Student',
			'Junior Professional (0-2 years experience)',
			'Mid-Level Professional (3-6 years experience)',
			'Senior Professional (7+ years experience)',
			'Entrepreneur/Business Owner',
		],
		category: 'expertise',
	},
	{
		id: 2,
		question: 'Industry you work in',
		type: 'input_text',
		category: 'expertise',
		placeholder: 'Enter your industry',
	},
	{
		id: 3,
		question:
			"Describe a project you worked on that you're most proud of. What was your role, and what challenges did you overcome?",
		type: 'input_text',
		placeholder: 'Provide a brief description of your project...',
		category: 'expertise',
	},
	{
		id: 4,
		question: 'How do you usually approach a problem in your field of work?',
		type: 'multiple_choice',
		options: [
			'I research thoroughly before taking action',
			'I experiment and learn through trial and error',
			'I consult with colleagues or mentors',
			'I rely on past experience and intuition',
			'I delegate or outsource the problem-solving process',
		],
		category: 'behavior',
	},
	{
		id: 5,
		question: 'Which profession are you applying for?',
		type: 'input_text',
		placeholder: 'Enter your profession...',
		category: 'personal_information',
	},
]

// Timer duration in seconds (10 minutes = 600 seconds)
const TIMER_DURATION = 600

export default function QuestionnairePage() {
	const router = useRouter()
	const [hasAgreed, setHasAgreed] = useState(false)
	const [currentStep, setCurrentStep] = useState(0)
	const [answers, setAnswers] = useState<Record<number, string>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION)
	const [showTimeWarning, setShowTimeWarning] = useState(false)
	const [aiQuestionnaireId, setAiQuestionnaireId] = useState(0)
	const [availableCredits, setAvailableCredits] = useState(0)
	const [fetchingCredits, setFetchingCredits] = useState(false)

	const totalQuestions = questionnaireData.length
	const currentQuestion = questionnaireData[currentStep]
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

			const unansweredQuestions = questionnaireData.filter(q => !answers[q.id])

			if (isAutoSubmit && unansweredQuestions.length > 0) {
				toast.warning(`Time's up!`, {
					description: `Submitting your questionnaire with ${
						totalQuestions - unansweredQuestions.length
					} of ${totalQuestions} questions answered.`,
				})
			}

			const formattedAnswers = questionnaireData.map(question => ({
				id: question.id,
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
				const response = await fetch('/api/submit-questionnaire-answer', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						answers: formattedAnswers,
						autoSubmitted: isAutoSubmit,
					}),
				})

				if (!response.ok) {
					throw new Error('Failed to submit questionnaire')
				}

				const realResponse = await response.json()
				setAiQuestionnaireId(realResponse.aiQuestionSaveResponse.assessmentId)
				setSuccess(true)
				setIsSubmitting(false)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An unknown error occurred')
				setIsSubmitting(false)
			}
		},
		[answers, isSubmitting, totalQuestions]
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
			toast('3 minutes remaining', {
				description: 'Please try to complete the questionnaire soon.',
			})
		} else if (timeRemaining === 60) {
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
		const newObj: Array<Question & { answer: string }> = []

		questionnaireData.forEach(ques => {
			if (answers[ques.id]) {
				const quesWithAns: Question & { answer: string } = { ...ques, answer: answers[ques.id] }
				newObj.push(quesWithAns)
			}
		})

		submitForm(false)
	}

	const getAvailableCreditsCallback = async () => {
		setFetchingCredits(true)

		await new Promise(resolve => setTimeout(resolve, 2000))

		const response = await fetch('/api/avail-credits')
		const data = await response.json()
		setAvailableCredits(data.availableCredits)
		setFetchingCredits(false)
	}

	useEffect(() => {
		if (success || isSubmitting) {
			getAvailableCreditsCallback()
		}
	}, [success, isSubmitting])

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
								We&apos;ll analyze your responses and create personalized contests tailored to your expertise and development style.
							</p>
						</CardContent>
						<CardFooter className="flex flex-col items-center justify-center space-y-2">
							{success ? (
								<>
									{!fetchingCredits ? (
										availableCredits > 0 ? (
											<Button asChild>
												<Link href={`/user/questionnaire/ai/${aiQuestionnaireId}`}>Use 1 Credit to Proceed</Link>
											</Button>
										) : (
											<p className="text-sm text-muted-foreground">You have no credits left.</p>
										)
									) : (
										<Button disabled>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Checking Credits...
										</Button>
									)}
								</>
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
			<Dialog open={!hasAgreed} onOpenChange={() => router.push('/')}>
				<DialogContent showCross={false}>
					<DialogHeader>
						<DialogTitle>Are you ready to attempt the questionnaire?</DialogTitle>
						<DialogDescription>
							<span className="block w-full">
								Click &quot;Yes&quot; to start. The timer will begin once you proceed
 <br />
								<span>Time remaining: {formatTime(timeRemaining)}</span>
							</span>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant={'destructive'} onClick={() => router.push('/')}>
							Go, Back
						</Button>
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
							{currentQuestion.category === 'expertise' ? 'Professional Expertise' : 'Work Behavior'}
						</div>
						<CardTitle onCopy={e => e.preventDefault()}>{currentQuestion.question}</CardTitle>
					</CardHeader>
					<CardContent>
						{currentQuestion.type === 'multiple_choice' && (
							<RadioGroup
								onCopy={e => e.preventDefault()}
								disabled={isSubmitting}
								value={answers[currentQuestion.id] || ''}
								onValueChange={handleAnswerChange}
								className="space-y-3">
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
							<>
								<Textarea
									value={answers[currentQuestion.id] || ''}
									onChange={e => handleAnswerChange(e.target.value)}
									placeholder={currentQuestion.placeholder}
									className="min-h-[150px]"
									disabled={isSubmitting}
									onPaste={e => e.preventDefault()}
									maxLength={200}
								/>
								<p className="text-xs text-muted-foreground mt-1">{answers[currentQuestion.id]?.length || 0}/200</p>
							</>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="outline" onClick={handlePreviousQuestion} disabled={currentStep === 0}>
							<ArrowLeft className="mr-2 h-4 w-4" /> Previous
						</Button>

						{!isLastQuestion ? (
							<Button onClick={handleNextQuestion} disabled={!isCurrentQuestionAnswered()}>
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
						{currentQuestion.category === 'expertise'
							? 'Questions about your professional background'
							: 'Questions about your work style'}
					</span>
					<span>
						{Object.keys(answers).length} of {totalQuestions} answered
					</span>
				</div>
			</main>
		</div>
	)
}
