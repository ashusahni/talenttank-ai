// this api route is used to calculate the token count

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import prisma from '@/lib/prisma/prisma'

const openai = new OpenAI()

async function getTokenCountFirst() {
	const answers = [
		{
			id: 1,
			type: 'multiple_choice',
			options: [
				'Student',
				'Junior Professional (0-2 years experience)',
				'Mid-Level Professional (3-6 years experience)',
				'Senior Professional (7+ years experience)',
				'Entrepreneur/Business Owner',
			],
			category: 'expertise',
			question: 'Which of the following best describes your current role?',
		},
		{
			id: 1,
			type: 'multiple_choice',
			options: [
				'Student',
				'Junior Professional (0-2 years experience)',
				'Mid-Level Professional (3-6 years experience)',
				'Senior Professional (7+ years experience)',
				'Entrepreneur/Business Owner',
			],
			category: 'expertise',
			question: 'Which of the following best describes your current role?',
		},
		{
			id: 1,
			type: 'multiple_choice',
			options: [
				'Student',
				'Junior Professional (0-2 years experience)',
				'Mid-Level Professional (3-6 years experience)',
				'Senior Professional (7+ years experience)',
				'Entrepreneur/Business Owner',
			],
			category: 'expertise',
			question: 'Which of the following best describes your current role?',
		},
		{
			id: 1,
			type: 'multiple_choice',
			options: [
				'Student',
				'Junior Professional (0-2 years experience)',
				'Mid-Level Professional (3-6 years experience)',
				'Senior Professional (7+ years experience)',
				'Entrepreneur/Business Owner',
			],
			category: 'expertise',
			question: 'Which of the following best describes your current role?',
		},
	]

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

	const response = await openai.chat.completions.create({
		model: 'o3-mini',
		messages: [
			{ role: 'system', content: prompt },
			{ role: 'user', content: JSON.stringify(answers) },
		],
	})

	console.log('Total Tokens Used:', response.usage)
	return NextResponse.json(response)
}

async function getTokenCountSecond() {
	const validAnswers = await prisma.aIQuestionnaireAnswers.findFirst({ where: { userId: 'cm8txaogj0000130v3zche79m' } })

	const prompt = `Analyze candidate responses from the Predictive Index (PI) and Emotional Intelligence (EQ) assessments to generate a comprehensive evaluation report. The analysis should highlight strengths, areas for improvement, and overall suitability for the desired role.  
		
		### **Instructions:**

		 1. **Input Data:**  
   - Gather responses from the information, including:
     - Personal Information
     - Professional Background
     - Assessment Preferences
     - Skills and Interests
     - Responses to PI and EQ questions
		 
		 2. **Analysis Criteria:**  
   Evaluate each candidate based on the following dimensions:
   - **Predictive Index Analysis:**
     - Behavioral Traits: Assess alignment with key traits (e.g., Dominance, Influence, Steadiness, Conscientiousness).
     - Cognitive Abilities: Analyze problem-solving skills and reasoning capabilities.
     - Job Fit: Determine how well the candidate's traits align with the requirements of the desired role.

   - **Emotional Intelligence Analysis:**
     - Self-Awareness: Evaluate responses indicating self-reflection and understanding of personal emotions.
     - Social Skills: Assess ability to manage relationships and navigate social complexities.
     - Empathy: Analyze responses that demonstrate understanding and consideration of others' feelings.

		 3. **Scoring System:**  
   Implement a scoring system for each dimension:
   - Use a scale of 1-5 (1 = Poor, 5 = Excellent) for each trait/skill assessed.
   - Provide an average score for both PI and EQ sections.

	   4. **Result Presentation:**  
   Generate a report that includes:
   - **Candidate Overview:** Basic information and professional background.
   - **Strengths:** Highlight top traits/skills based on analysis.
   - **Areas for Improvement:** Identify specific areas where the candidate can enhance their skills.
   - **Overall Suitability:** A summary statement regarding the candidate's fit for the desired role, supported by data from the analysis.
   - **Recommendations:** Suggestions for further development or training based on identified gaps.

		5. **Visualization:**  
		   Include graphs or charts to visually represent:
		   - Trait distributions (e.g., radar charts for PI traits).
		   - Average scores for PI and EQ dimensions.
		   - Comparison against role requirements (if applicable).

		6. **Feedback Loop:**  
		   Allow candidates to receive feedback based on their results, including:
		   - Personalized insights on their performance.
		   - Resources or training programs that could help them improve in specific areas.

		### **Output Format:**  
		- Present results in a clear, professional report format.
		- Ensure that the language is accessible and constructive.

		candidate response: ${JSON.stringify(validAnswers).replaceAll('{', '').replaceAll('}', '')}		
`

	const response = await openai.chat.completions.create({
		model: 'o3-mini',
		messages: [
			{ role: 'system', content: prompt },
			{ role: 'user', content: JSON.stringify(validAnswers) },
		],
	})

	console.log('Total Tokens Used:', response.usage)

	return NextResponse.json({ validAnswers, response })
}

export async function GET() {
	const firstCount = await getTokenCountFirst()
	const secondCount = await getTokenCountSecond()

	return NextResponse.json({
		success: true,
		firstCount,
		secondCount,
		message: 'This api route is used to calculate the token count',
	})
}
