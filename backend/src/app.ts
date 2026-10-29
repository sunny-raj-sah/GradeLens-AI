
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRouter from "./routes/health.routes.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import demoRouter from "./routes/demo.routes.js";
import authRouter from "./routes/auth.routes.js";
import protectedRouter from "./routes/protected.routes.js";
import classroomRouter from "./routes/classroom.routes.js";
import studentRouter from "./routes/student.routes.js";
import homeworkRouter from "./routes/homework.routes.js";
import submissionRouter from "./routes/submission.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import proctorRoutes from "./routes/proctor.routes.js";
import aiRouter from "./routes/ai.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://grade-lens-ai-six.vercel.app",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permit requests without an Origin header, such as CLI health checks.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(requestLogger);

app.use("/api/health", healthRouter);
app.use("/api/demo", demoRouter);
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/classrooms", classroomRouter);
app.use("/api/students", studentRouter);
app.use("/api/homework", homeworkRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/quiz-results", quizRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/teachers", teacherRoutes);
app.use("/api/proctors", proctorRoutes);
app.use("/api/ai", aiRouter);

// Keep this after all routes.
app.use(errorHandler);

export default app;
