import { GoogleGenerativeAI } from "@google/generative-ai"

// Use GEMINI_API_KEY1 first, fall back to GEMINI_API_KEY2
const apiKey = process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

export const generateSyllabus = async ({
  name,
  goal,
  duration,
  level,
  intensity
}) => {

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `
You are an expert curriculum designer.

Create a structured learning syllabus for:

Subject: ${name}
Goal: ${goal || "General mastery"}
Duration: ${duration} weeks
Level: ${level}
Intensity: ${intensity}

Rules:
- Divide logically and progressively
- Keep realistic for duration
- Titles must be short
- Return ONLY JSON
- No explanation
- Format:
[
  { "title": "Topic 1" },
  { "title": "Topic 2" }
]
`

  const result = await model.generateContent(prompt)

  const text = result.response.text()

  // Clean Gemini output if wrapped in markdown
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch (err) {
    throw new Error("Gemini returned invalid JSON")
  }
}