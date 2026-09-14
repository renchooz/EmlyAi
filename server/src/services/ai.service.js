import { GoogleGenerativeAI } from "@google/generative-ai";

let model;

const getModel = () => {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
  }

  return model;
};

// Separate cached model instance (not `getModel()`'s) because this one
// carries a system instruction shaping it into a conversational assistant —
// the JSON-extraction tasks below must never pick that persona up.
let chatModel;

const getChatModel = () => {
  if (!chatModel) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    chatModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are EmlyAI, a friendly and concise assistant built into EmlyAI — a tool where users upload resumes, analyze job descriptions, generate tailored emails/cover letters, and send applications from their own Gmail. Help with resumes, job descriptions, interview prep, and career questions, and explain how to use the app's own features (Analyze JD, Cover Letter, One Click Apply, Email History) when relevant. Keep answers short and practical, formatted as plain text (no markdown). If asked something unrelated to careers or job applications, answer briefly and steer back to how EmlyAI can help.",
    });
  }

  return chatModel;
};

// gemini-2.5-flash reasons internally ("thinking") by default, and those
// thinking tokens are drawn from the SAME maxOutputTokens budget as the
// visible response. None of the tasks in this file need multi-step
// reasoning — they're all "return this exact JSON shape" tasks — so left
// enabled, thinking can silently consume the whole budget and truncate the
// JSON before it closes (this is exactly what caused generateJobEmail to
// intermittently return an unparsable response). Disabled everywhere here.
const generateText = async (prompt, generationConfig = {}) => {
  const result = await getModel().generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      thinkingConfig: { thinkingBudget: 0 },
      ...generationConfig,
    },
  });

  return result.response.text();
};

const extractJson = (text, notFoundMessage) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error(notFoundMessage);
  }

  return JSON.parse(jsonMatch[0]);
};

export const analyzeResumeWithJD = async (resumeText, jobDescription) => {
  const prompt = `
Analyze the resume against the job description.

Return ONLY valid JSON.

{
  "matchScore": number,
  "atsScore": number,
  "skillMatchScore": number,
  "experienceMatchScore": number,
  "keywordMatchScore": number,
  "strengths": [],
  "missingSkills": [],
  "suggestions": []
}

"matchScore" is the overall fit (0-100).
"atsScore" rates ATS/formatting/keyword compatibility (0-100).
"skillMatchScore" rates how well the candidate's skills match the role (0-100).
"experienceMatchScore" rates how well the candidate's experience level/domain matches the role (0-100).
"keywordMatchScore" rates keyword overlap between resume and job description (0-100).
All four sub-scores should be genuinely derived from comparing the resume and job description, not copies of matchScore.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const text = await generateText(prompt, { maxOutputTokens: 1200 });

  return extractJson(text, "Could not analyze the resume. Please try again.");
};

export const generateJobEmail = async (
  resumeText,
  jobDescription,
  companyName,
) => {
  const prompt = `
You are an expert career coach who writes concise job application emails that busy HR managers and recruiters actually read and reply to.

Generate a SHORT, high-impact job application email — not a cover letter, not an essay.

Return ONLY valid JSON:
{
  "subject": "",
  "emailBody": ""
}

COMPANY:
${companyName}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

STRICT RULES FOR subject:
- Under 60 characters
- Mention the role title from the job description
- Make it specific and attention-grabbing (avoid generic "Job Application")

STRICT RULES FOR emailBody:
- 90 to 140 words total — never exceed 150 words
- Exactly 3 short paragraphs separated by a blank line
- Paragraph 1 (1-2 sentences): Strong opening — show interest in this specific role at ${companyName}, mention the exact role title
- Paragraph 2 (2-3 sentences): Highlight only the 2 most relevant achievements or skills from the resume that match the job description — use numbers or outcomes when available
- Paragraph 3 (1-2 sentences): Clear call to action (availability for interview) + professional sign-off with the candidate's full name from the resume

TONE & STYLE:
- Confident, warm, and human — write like a strong candidate, not a template
- Easy to scan in under 20 seconds
- Do NOT repeat the entire resume or list every skill
- Do NOT use clichés like "I hope this email finds you well", "Dear Hiring Manager" without a name, or "I am writing to apply"
- Do NOT use markdown, bullet points, headings, or bold text
- Do NOT include placeholder links like [LinkedIn Profile Link]. Only include real links if they appear in the resume
- Return plain professional email text only
`;

  const text = await generateText(prompt, {
    temperature: 0.75,
    maxOutputTokens: 700,
  });

  const parsed = extractJson(
    text,
    "Could not generate the application email. Please try again.",
  );

  if (parsed.emailBody) {
    parsed.emailBody = parsed.emailBody
      .replace(/\*\*/g, "")
      .replace(/^[-*•]\s+/gm, "")
      .trim();
  }

  return parsed;
};

export const generateCoverLetter = async (
  resumeText,
  jobDescription,
  companyName,
) => {
  const prompt = `
You are a professional career assistant.

Generate a tailored cover letter based on the resume and job description.

Return ONLY valid JSON. No markdown.

{
  "title": "",
  "coverLetter": ""
}

COMPANY:
${companyName}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const text = await generateText(prompt, { maxOutputTokens: 1200 });

  return extractJson(text, "Could not generate the cover letter. Please try again.");
};

// `history` is the prior turns of THIS conversation as sent back by the
// client ({ role: "user" | "assistant", text }) — nothing is persisted
// server-side, so a page refresh starts a fresh conversation.
export const chatWithAssistant = async (history, message) => {
  const geminiHistory = (history || [])
    .filter((turn) => turn?.text)
    .map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.text }],
    }));

  const chat = getChatModel().startChat({
    history: geminiHistory,
    generationConfig: {
      thinkingConfig: { thinkingBudget: 0 },
      maxOutputTokens: 700,
    },
  });

  const result = await chat.sendMessage(message);

  return result.response.text().trim();
};

export const selectBestResume = async (resumes, jobDescription) => {
  const resumeData = resumes.map((resume, index) => ({
    index,
    resumeId: resume._id.toString(),
    resumeName: resume.originalName,
    resumeText: resume.extractedText.slice(0, 8000),
  }));

  const prompt = `
You are an expert ATS resume matcher.

Compare all resumes against the job description and select the best matching resume.

Return ONLY valid JSON. No markdown.

{
  "bestResumeIndex": 0,
  "resumeId": "",
  "resumeName": "",
  "matchScore": 0,
  "reason": "",
  "missingSkills": [],
  "strengths": []
}

RESUMES:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}
  `;

  const text = await generateText(prompt, { maxOutputTokens: 1200 });

  return extractJson(text, "Could not select the best resume. Please try again.");
};
