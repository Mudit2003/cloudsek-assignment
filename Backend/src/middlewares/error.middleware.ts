// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import IError from "../interfaces/error.interface";
import { error } from "console";
import { PrismaClientInitializationError, PrismaClientRustPanicError } from "@prisma/client/runtime/library";
import prisma from "../config/prisma.config";

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error did come here");
  console.error(`${err.name}: ${err.message}`);

  if(error instanceof PrismaClientRustPanicError || error instanceof PrismaClientInitializationError){
    var retryCount = 0 ; 
    const MAX_RETRIES = 7;
    const retryPrismaConnection = async () => {
      while (retryCount < MAX_RETRIES) {
        try {
          retryCount++;
          console.log(`Attempting to reconnect to Prisma... (Attempt ${retryCount})`);
          await prisma.$connect();
          console.log("Prisma reconnected successfully.");
          retryCount = 0; // Reset retry count after a successful connection
          break;
        } catch (error) {
          console.error(`Prisma reconnection attempt ${retryCount} failed.`);
          if (retryCount >= MAX_RETRIES) {
            console.error("Max reconnection attempts reached. Could not reconnect to Prisma.");
          } else {
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
          }
        }
      }
    };
  }

  res.status(err.status || 500).json({
    error: {
      name: err.name || "ServerError",
      message: err.message || "Request Cannot be Served",
      status: err.status || 500,
    },
  });
};

export default errorHandler;
