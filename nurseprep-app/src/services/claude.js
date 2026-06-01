const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

export async function generateQuestions(topic, difficulty) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    throw new Error(
      'API key not configured. Copy .env.example to .env and add your Anthropic API key.'
    )
  }

  const prompt = `You are an expert NCLEX exam question writer and nursing educator. Generate exactly 5 NCLEX-style multiple choice questions about "${topic}" at the "${difficulty}" level.

Return ONLY a valid JSON array — no markdown, no code fences, no explanation text before or after. The array must contain exactly 5 question objects with this exact structure:

[
  {
    "question": "Clinical scenario and question text here",
    "options": {
      "A": "First answer option",
      "B": "Second answer option",
      "C": "Third answer option",
      "D": "Fourth answer option"
    },
    "correctAnswer": "B",
    "rationale": "Comprehensive explanation: why the correct answer is right AND why each incorrect option is wrong. Include clinical reasoning, pathophysiology, or nursing priorities as appropriate."
  }
]

Requirements:
- Use realistic clinical scenarios (patient age, setting, symptoms, vitals where relevant)
- Exactly one clearly correct answer per question
- Distractors should be plausible but clearly incorrect upon clinical reflection
- Rationale must address all four options individually
- Match the difficulty level: ${difficulty}
- Topics should be clinically relevant to ${topic}`

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const msg = errorData?.error?.message || `API error (${response.status})`
    throw new Error(msg)
  }

  const data = await response.json()
  const text = data.content[0].text

  // Strip markdown code fences if Claude wraps the response
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  let questions
  try {
    questions = JSON.parse(cleaned)
  } catch {
    throw new Error('Could not parse the AI response. Please try again.')
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Unexpected response format from AI. Please try again.')
  }

  return questions
}
