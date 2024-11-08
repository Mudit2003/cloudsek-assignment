import express, { Request, Response , Application, ErrorRequestHandler, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import postRoutes from './routes/post.route';
import commentRoutes from './routes/comment.route';
// import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// Routes
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
// app.use('/api/uploads', uploadRoutes);

interface CustomError extends Error {
    status?: number;
}
  
// Error handling middleware (add a custom error handler if necessary)
const errorHandler: ErrorRequestHandler = (err:CustomError, req:Request, res:Response, next:NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

app.use(errorHandler);

export default app;
