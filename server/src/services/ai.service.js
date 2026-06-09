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
You are a professional recruiter assistant.

Generate:

1. Email Subject
2. Professional Job Application Email

Return ONLY valid JSON.

{
  "subject":"",
  "emailBody":""
}

COMPANY:
${companyName}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
Do not include placeholder links like [LinkedIn Profile Link] or [GitHub Profile Link]. Only include links if they are present in the resume text. and Do not use markdown formatting like **bold**, bullet markdown, or headings. Return plain professional email text only. `;

  const result = await getModel().generateContent(prompt);

  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  return JSON.parse(jsonMatch[0]);
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
