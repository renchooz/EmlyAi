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

export const analyzeResumeWithJD = async (resumeText, jobDescription) => {
  const prompt = `
Analyze the resume against the job description.

Return ONLY valid JSON.

{
  "matchScore": number,
  "strengths": [],
  "missingSkills": [],
  "suggestions": []
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const result = await getModel().generateContent(prompt);

  const response = result.response.text();

  return JSON.parse(response.replace(/```json|```/g, "").trim());
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

  const result = await getModel().generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 450,
    },
  });

  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  const parsed = JSON.parse(jsonMatch[0]);

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

  const result = await getModel().generateContent(prompt);

  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No valid JSON returned by Gemini");
  }

  return JSON.parse(jsonMatch[0]);
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

  const result = await getModel().generateContent(prompt);

  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No valid JSON returned by Gemini");
  }

  return JSON.parse(jsonMatch[0]);
};
