import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import requestLogger from "./middleware/requestLogger";
import errorHandler from "./middleware/errorHandler";
import racksRouter from "./modules/racks/racks.routes";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Parsing middleware
app.use(express.json());
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Racks Routes
app.use("/api/racks", racksRouter);

// Health check
app.get("/healthz", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export default app;
