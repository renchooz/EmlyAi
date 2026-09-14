import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  analyzeResumeApi,
  getAnalysisHistoryApi,
  generateEmailApi,
  generateCoverLetterApi,
  selectBestResumeApi,
  oneClickApplyApi,
  previewApplicationApi,
  chatWithAIApi,
} from "../api/aiApi";
import { useAuth } from "./AuthContext";

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const [aiLoading, setAiLoading] = useState(false);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [analysisHistoryLoading, setAnalysisHistoryLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [bestResume, setBestResume] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);
  const [applicationPreview, setApplicationPreview] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const { user } = useAuth();

  const clearAIResults = () => {
  setAnalysisResult(null);
  setAnalysisHistory([]);
  setGeneratedEmail(null);
  setCoverLetter(null);
  setBestResume(null);
  setApplicationResult(null);
  setApplicationPreview(null);
  setChatMessages([]);
};

  const fetchAnalysisHistory = async () => {
    try {
      setAnalysisHistoryLoading(true);
      const { data } = await getAnalysisHistoryApi();
      setAnalysisHistory(data.analyses || []);
      return data.analyses;
    } catch (error) {
      toast.error(error.message || "Failed to fetch analysis history");
      return [];
    } finally {
      setAnalysisHistoryLoading(false);
    }
  };

useEffect(() => {
  if (user) {
    fetchAnalysisHistory();
  } else {
    clearAIResults();
  }
}, [user]);

  const analyzeResume = async ({ resumeId, jobDescription, companyName, jobTitle }) => {
    try {
      if (!resumeId || !jobDescription?.trim()) {
        toast.error("Resume and job description are required");
        return null;
      }

      setAiLoading(true);

      const { data } = await analyzeResumeApi({
        resumeId,
        jobDescription,
        companyName,
        jobTitle,
      });

      setAnalysisResult(data.analysis);
      fetchAnalysisHistory();
      toast.success("Resume analyzed successfully");

      return data.analysis;
    } catch (error) {
      toast.error(error.message || "Analysis failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const generateEmail = async ({ resumeId, jobDescription, companyName }) => {
    try {
      if (!resumeId || !jobDescription?.trim()) {
        toast.error("Resume and job description are required");
        return null;
      }

      setAiLoading(true);

      const { data } = await generateEmailApi({
        resumeId,
        jobDescription,
        companyName,
      });

      setGeneratedEmail(data.email);
      toast.success("Email generated successfully");

      return data.email;
    } catch (error) {
      toast.error(error.message || "Email generation failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const generateCoverLetter = async ({
    resumeId,
    jobDescription,
    companyName,
  }) => {
    try {
      if (!resumeId || !jobDescription?.trim()) {
        toast.error("Resume and job description are required");
        return null;
      }

      setAiLoading(true);

      const { data } = await generateCoverLetterApi({
        resumeId,
        jobDescription,
        companyName,
      });

      setCoverLetter(data.coverLetter);
      toast.success("Cover letter generated successfully");

      return data.coverLetter;
    } catch (error) {
      toast.error(error.message || "Cover letter generation failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const selectBestResume = async ({ jobDescription }) => {
    try {
      if (!jobDescription?.trim()) {
        toast.error("Job description is required");
        return null;
      }

      setAiLoading(true);

      const { data } = await selectBestResumeApi({
        jobDescription,
      });

      setBestResume(data.bestResume);
      toast.success("Best resume selected");

      return data.bestResume;
    } catch (error) {
      toast.error(error.message || "Best resume selection failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const oneClickApply = async ({ to, companyName, jobDescription }) => {
    try {
      if (!to || !companyName || !jobDescription?.trim()) {
        toast.error("HR email, company name and job description are required");
        return null;
      }

      setAiLoading(true);

      const { data } = await oneClickApplyApi({
        to,
        companyName,
        jobDescription,
      });

      setApplicationResult(data.application);
      toast.success("Application sent successfully");

      return data.application;
    } catch (error) {
      toast.error(error.message || "Application failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  };
  const previewApplication = async ({ to, companyName, jobDescription }) => {
    try {
      if (!to || !companyName || !jobDescription?.trim()) {
        toast.error("HR email, company name and job description are required");
        return null;
      }

      setAiLoading(true);

      const { data } = await previewApplicationApi({
        to,
        companyName,
        jobDescription,
      });

      setApplicationPreview(data.preview);
      toast.success("Application preview generated");

      return data.preview;
    } catch (error) {
      toast.error(error.message || "Preview generation failed");
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  // `history` is the conversation BEFORE this new message — the backend
  // appends `message` itself, so the message being sent isn't duplicated.
  const sendChatMessage = async (message) => {
    const trimmed = message?.trim();
    if (!trimmed) return;

    const history = chatMessages;
    setChatMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setChatLoading(true);

    try {
      const { data } = await chatWithAIApi({ message: trimmed, history });
      setChatMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      toast.error(error.message || "EmlyAI couldn't reply — try again");
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again.", failed: true },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const clearChat = () => setChatMessages([]);

  return (
    <AIContext.Provider
      value={{
        aiLoading,
        analysisResult,
        analysisHistory,
        analysisHistoryLoading,
        fetchAnalysisHistory,
        generatedEmail,
        coverLetter,
        bestResume,
        applicationResult,
        analyzeResume,
        generateEmail,
        generateCoverLetter,
        selectBestResume,
        oneClickApply,
        clearAIResults,
        applicationPreview,
        previewApplication,
        setApplicationPreview,
        chatMessages,
        chatLoading,
        sendChatMessage,
        clearChat,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
