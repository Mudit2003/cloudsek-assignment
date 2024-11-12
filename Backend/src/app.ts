import express, { Application } from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import postRoutes from "./routes/post.route";
import commentRoutes from "./routes/comment.route";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import { authenticateRequest } from "./middlewares/auth.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();
app.set('trust proxy' , true)

// Middleware
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Routes
app.use("/api/v1/posts", authenticateRequest, postRoutes);
app.use("/api/v1/comments", authenticateRequest, commentRoutes);
app.use("/api/v1/users", authenticateRequest, userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
