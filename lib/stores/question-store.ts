'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question } from '@/types/questions'

// Sample initial data
const initialQuestions: Question[] = [
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
]

interface QuestionStore {
	questions: Question[]
	addQuestion: (question: Omit<Question, 'id'>) => void
	updateQuestion: (question: Question) => void
	deleteQuestion: (id: number) => void
}

export const useQuestionStore = create<QuestionStore>()(
	persist(
		set => ({
			questions: initialQuestions,

			addQuestion: question =>
				set(state => {
					// Generate a new ID (max ID + 1)
					const newId = state.questions.length > 0 ? Math.max(...state.questions.map(q => q.id)) + 1 : 1

					return {
						questions: [...state.questions, { ...question, id: newId } as Question],
					}
				}),

			updateQuestion: updatedQuestion =>
				set(state => ({
					questions: state.questions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q)),
				})),

			deleteQuestion: id =>
				set(state => ({
					questions: state.questions.filter(q => q.id !== id),
				})),
		}),
		{
			name: 'question-store',
		}
	)
)
