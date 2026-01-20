import { NextResponse } from 'next/server'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { auth } from '@/auth'
import { z } from 'zod'
import { AiQuestionSchema, questionSchema } from '@/utils/zod/questions-schema'
import { ChatOpenAI } from '@langchain/openai'
import prisma from '@/lib/prisma/prisma'
import { Question } from '@/types/questions'

const llm = new ChatOpenAI({
	modelName: 'o3-mini',
})

export async function POST(request: Request) {
	const session = await auth()
	const user = session?.user

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		// Parse the request body
		const body = await request.json()
		const { answers } = body // Answers from the frontend

		const dbSaveResponse = await SaveNormalAnswerToDB(answers, user.id!)

		const prompt = `Generate 50 follow-up questions based on the given answers to assess Predictive Index (PI) and Emotional Intelligence (EQ).
    
    Guidelines:
    - 25 questions should assess Predictive Index (PI): behavioral traits, cognitive abilities, and job fit.
    - 25 questions should assess Emotional Intelligence (EQ): self-awareness, relationship management, and empathy.
		- Use various formats: multiple-choice, situational judgment, true/false, scenario-based, and open-ended (input_text).
		- For "input_text" questions, do NOT include "options".
    - Tailor questions to real-world workplace challenges.
    - Base follow-up questions on these candidate responses: ${JSON.stringify(answers)
					.replaceAll('{', '')
					.replaceAll('}', '')}
    
		Example input_text question:
		{{
		  "id": 10,
		  "question": "Describe a time when you had to manage a difficult workplace situation.",
		  "type": "input_text",
		  "placeholder": "Write your response here...",
		  "category": "emotional_intelligence"
		}}
				
		Provide questions formatted as a JSON array, following this schema:
		{{
		  "id": number,
		  "question": string,
		  "type": "multiple_choice" | "input_text",
		  "options": [string, string, string, string] (optional, only for multiple_choice),
		  "placeholder": string (optional, only for input_text),
		  "category": "predictive_index" | "emotional_intelligence"
		}}`

		const promptTemplate = ChatPromptTemplate.fromMessages([
			['system', prompt],
			['human', '{text}'],
		])

		const QuestionArraySchema = z.object({
			count: z.number(),
			questions: z.array(AiQuestionSchema),
		})

		const structured_llm = llm.withStructuredOutput(QuestionArraySchema, { name: 'questions' })
		const promptResponse = await promptTemplate.invoke({
			text: prompt,
		})

		const questions = await structured_llm.invoke(promptResponse)
		const aiQuestionSaveResponse = await SaveAiQuestionsToDB(questions.questions, questions.count)

		return NextResponse.json({
			success: true,
			dbSaveResponse,
			aiQuestionSaveResponse,
		})
	} catch (error) {
		console.error('Error generating questions:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Failed to generate follow-up questions',
			},
			{ status: 500 }
		)
	}
}

async function SaveAiQuestionsToDB(questions: z.infer<typeof AiQuestionSchema>[], questionCount: number) {
	// Step 1: Create the assessment first
	const createdAssessment = await prisma.aIQuestionnaire.create({
		data: {
			totalQuestions: questionCount,
		},
	})

	console.log(createdAssessment, 'from 159')

	// Step 2: Add questions separately
	if (questions.length > 0) {
		const formattedQuestions = z.array(AiQuestionSchema).parse(questions)

		await prisma.aIQuestion.createMany({
			data: formattedQuestions.map(q => ({
				question: q.question,
				type: q.type,
				options: q.options || [],
				placeholder: q.placeholder || '',
				category: q.category,
				aIQuestionnaireId: createdAssessment.id, // Link to the assessment
			})),
		})
	}

	return {
		success: true,
		assessmentId: createdAssessment.id,
	}
}

async function SaveNormalAnswerToDB(question: Question, userId: string) {
	if (!userId) {
		return NextResponse.json({ success: false, message: 'User ID is missing' })
	}

	const formattedQuestions = z.array(questionSchema).parse(question)

	const response = await prisma.user.update({
		where: { id: userId },
		data: {
			Answers: { createMany: { data: [{ answers: formattedQuestions }] } },
		},
	})

	console.log(response, 'from 163')

	return {
		success: true,
		assessmentId: formattedQuestions,
		response,
	}
}
