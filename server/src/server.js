import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Learnora API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Something went wrong on the server."
  });
});

try {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`API listening at http://localhost:${PORT}`));
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
