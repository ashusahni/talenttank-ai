// These are the types of questions which are firstly being asked to the user.
export interface Question {
	id: number
	question: string
	type: 'multiple_choice' | 'input_text'
	options?: string[]
	placeholder?: string
	category: 'personal_information' | 'expertise' | 'behavior'
}
