import prisma from '@/lib/prisma/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'

const llm = new ChatOpenAI({
	modelName: 'o3-mini',
})

const aiAnswerSchema = z.array(
	z.object({
		aiQuestionId: z.number(),
		answer: z.string(),
		category: z.enum(['predictive_index', 'emotional_intelligence']),
		placeholder: z.string().optional(),
		options: z.array(z.string()),
		type: z.enum(['multiple_choice', 'input_text']),
		question: z.string(),
	})
)

async function getAvailableCredits(userId: string) {
	const availableCredits = await prisma.user.findUnique({
		where: { id: userId },
		select: { totalCredits: true, usedCredits: true },
	})

	const totalCredits = availableCredits?.totalCredits ? availableCredits.totalCredits : 0
	const usedCredits = availableCredits?.usedCredits ? availableCredits.usedCredits : 0

	return totalCredits - usedCredits
}

async function increaseUsedCredits({ userId, increaseBy = 1 }: { userId: string; increaseBy?: number }) {
	const availableCredits = await prisma.user.findUnique({
		where: { id: userId },
		select: { totalCredits: true, usedCredits: true },
	})

	const usedCredits = availableCredits?.usedCredits ? availableCredits.usedCredits : 0

	await prisma.user.update({
		where: { id: userId },
		data: {
			usedCredits: usedCredits + increaseBy,
		},
	})
}

export async function POST(req: Request) {
	try {
		const session = await auth()
		const user = session?.user

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const availableCredits = await getAvailableCredits(user.id!)
		if (availableCredits <= 0) {
			return NextResponse.json({ error: 'No credits available' }, { status: 400 })
		}

		increaseUsedCredits({ userId: user.id!, increaseBy: 1 })

		const { answers, aiQuestionnaireId } = await req.json()

		const parsedAnswers = aiAnswerSchema.parse(answers)
		console.log(parsedAnswers, aiQuestionnaireId, 'from here')

		const validAnswers = parsedAnswers.map(answer => ({
			aiQuestionId: answer.aiQuestionId,
			answer: answer.answer,
			category: answer.category,
			placeholder: answer.placeholder,
			options: answer.options,
			type: answer.type,
			question: answer.question,
		}))

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

		const promptTemplate = ChatPromptTemplate.fromMessages([
			['system', prompt],
			['human', '{text}'],
		])

		const AiAnalysisResponse = z.object({
			averagePredictiveIndex: z.number(),
			averageEmotionalIntelligence: z.number(),
			userSummary: z.string(),
			improvementSuggestions: z.string(),
			overallSuitability: z.string(),
			areasForImprovement: z.string(),
			feedback: z.string(),
			strengths: z.array(z.string()),
			candidateOverview: z.string(),
		})

		const structured_llm = llm.withStructuredOutput(AiAnalysisResponse, { name: 'ai_analysis' })
		const promptResponse = await promptTemplate.invoke({
			text: prompt,
		})

		const aiAnalysis = await structured_llm.invoke(promptResponse)

		const savedAnswers = await prisma.aIQuestionnaireAnswers.create({
			data: {
				answersWithQuestions: validAnswers,
				aiQuestionnaireId: Number(aiQuestionnaireId),
				userId: user.id!,
				averagePredictiveIndex: aiAnalysis.averagePredictiveIndex,
				averageEmotionalIntelligence: aiAnalysis.averageEmotionalIntelligence,
				userSummary: aiAnalysis.userSummary,
				improvementSuggestions: aiAnalysis.improvementSuggestions,
				overallSuitability: aiAnalysis.overallSuitability,
				areasForImprovement: aiAnalysis.areasForImprovement,
				feedback: aiAnalysis.feedback,
				strengths: aiAnalysis.strengths,
				candidateOverview: aiAnalysis.candidateOverview,
			},
		})

		console.log(savedAnswers, 'from saved answers')
		return NextResponse.json({ message: 'success', savedAnswers }, { status: 200 })
	} catch (error) {
		console.log(error)
		return NextResponse.json({ error: error ? error : 'Invalid request' }, { status: 400 })
	}
}
