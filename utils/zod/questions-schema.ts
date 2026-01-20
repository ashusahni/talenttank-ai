import { z } from 'zod'

const QuestionTypeEnum = z.enum(['multiple_choice', 'input_text'])

export const AiQuestionSchema = z.object({
	id: z.number(), // id must be a number
	question: z.string(), // question must be a string
	type: QuestionTypeEnum, // type must match the QuestionType enum
	options: z.array(z.string()).optional(), // options is an array of strings and is optional
	placeholder: z.string().optional(), // placeholder is a string and optional
	category: z.enum(['predictive_index', 'emotional_intelligence']), // category must match the QuestionCategory enum
})

export const questionSchema = z.object({
	id: z.number(),
	question: z.string(),
	type: QuestionTypeEnum,
	options: z.array(z.string()).optional(),
	placeholder: z.string().optional(),
	category: z.enum(['personal_information', 'expertise', 'behavior']),
})
