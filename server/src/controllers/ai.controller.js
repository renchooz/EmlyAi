import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";

import {
  analyzeResumeWithJD,
  generateCoverLetter,
  generateJobEmail,
  selectBestResume,
  chatWithAssistant
} from "../services/ai.service.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription, companyName, jobTitle } = req.body;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    const aiResult = await analyzeResumeWithJD(
      resume.extractedText,
      jobDescription
    );

    const analysis = await Analysis.create({
      user: req.user._id,
      resume: resume._id,
      jobDescription,
      companyName,
      jobTitle,
      ...aiResult
    });

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const generateEmail = async (req, res) => {
  try {
    const {
      resumeId,
      jobDescription,
      companyName
    } = req.body;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    const email = await generateJobEmail(
      resume.extractedText,
      jobDescription,
      companyName
    );

    res.status(200).json({
      success: true,
      email
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const generateCoverLetterController = async (req, res) => {
  try {
    const { resumeId, jobDescription, companyName } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and job description are required"
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    const coverLetter = await generateCoverLetter(
      resume.extractedText,
      jobDescription,
      companyName || "the company"
    );

    res.status(200).json({
      success: true,
      coverLetter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const reply = await chatWithAssistant(
      Array.isArray(history) ? history : [],
      message.trim()
    );

    res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const selectBestResumeController = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description is required"
      });
    }

    const resumes = await Resume.find({
      user: req.user._id
    });

    if (!resumes.length) {
      return res.status(404).json({
        success: false,
        message: "No resumes found"
      });
    }

    const bestResume = await selectBestResume(
      resumes,
      jobDescription
    );

    res.status(200).json({
      success: true,
      bestResume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};