import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import gmailRoutes from "./routes/gmail.routes.js";
import emailRoutes from "./routes/email.routes.js";
import applyRoutes from "./routes/apply.routes.js";
import { configDotenv } from "dotenv";
import path from "path"
import { httpRequestDuration, metricsRegistry } from "./metrics.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/ai", aiRoutes);
app.use("/api/gmail", gmailRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/apply", applyRoutes);
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });

  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  res.send("AI Resume Sender Backend Running");
});

export default app;