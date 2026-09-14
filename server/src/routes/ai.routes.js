import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  analyzeResume,
  generateCoverLetterController,
  generateEmail,
  selectBestResumeController,
  getAnalysisHistory,
  chatWithAI
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  analyzeResume
);

router.get(
  "/analyses",
  protect,
  getAnalysisHistory
);

router.post(
  "/generate-email",
  protect,
  generateEmail
);

router.post(
  "/generate-cover-letter",
  protect,
  generateCoverLetterController
);


router.post(
  "/select-best-resume",
  protect,
  selectBestResumeController
);

router.post(
  "/chat",
  protect,
  chatWithAI
);

export default router;