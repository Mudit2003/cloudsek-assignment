// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import IError from "../interfaces/error.interface";
import {
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/library";
import prisma from "../config/prisma.config";
import logger from "../config/logger.config";

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug("Interrupted");
  if (
    err instanceof PrismaClientRustPanicError ||
    err instanceof PrismaClientInitializationError
  ) {
    var retryCount = 0;
    const MAX_RETRIES = 7;
    const retryPrismaConnection = async () => {
      while (retryCount < MAX_RETRIES) {
        try {
          retryCount++;
          await prisma.$connect();
          retryCount = 0; // Reset retry count after a successful connection
          break;
        } catch (error) {
          if (retryCount >= MAX_RETRIES) {
            logger.error("Max Retries Limit Reached");
          } else {
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
          }
        }
      }
    };
    retryPrismaConnection();
  }

  res.status(err.status || 500).json({
    error: {
      name: err.name || "ServerError",
      message: err.message || "Request Cannot be Served",
      status: err.status || 500,
    },
  });
 return;
  
};

export default errorHandler;
