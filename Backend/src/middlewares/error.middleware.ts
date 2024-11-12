// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import IError from "../interfaces/error.interface";

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error did come here");
  console.error(`${err.name}: ${err.message}`);

  res.status(err.status || 500).json({
    error: {
      name: err.name || "ServerError",
      message: err.message || "Request Cannot be Served",
      status: err.status || 500,
    },
  });
};

export default errorHandler;
