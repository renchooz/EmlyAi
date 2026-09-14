import api from "./axios";

export const analyzeResumeApi = (payload) => {
  return api.post("/ai/analyze", payload);
};

export const getAnalysisHistoryApi = () => {
  return api.get("/ai/analyses");
};

export const generateEmailApi = (payload) => {
  return api.post("/ai/generate-email", payload);
};

export const generateCoverLetterApi = (payload) => {
  return api.post("/ai/generate-cover-letter", payload);
};

export const selectBestResumeApi = (payload) => {
  return api.post("/ai/select-best-resume", payload);
};

export const oneClickApplyApi = (payload) => {
  return api.post("/apply/one-click", payload);
};

export const previewApplicationApi = (payload) => {
  return api.post("/apply/preview", payload);
};

export const chatWithAIApi = (payload) => {
  return api.post("/ai/chat", payload);
};