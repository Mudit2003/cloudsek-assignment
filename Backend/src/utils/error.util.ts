import { NextFunction } from "express";
import IError from "../interfaces/error.interface";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  DatabaseConnectionError,
  ValidationError,
} from "../errors/config.error";
import logger from "../config/logger.config";
import { CustomError } from "../errors/custom.error";

export const errorCastWithParams = (
  next: NextFunction,
  error: unknown,
  defaultError: (error: Error) => IError
) => {
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientValidationError
  )
    next(ValidationError(error.message));
  else if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError
  )
    next(
      new CustomError(
        DatabaseConnectionError.name,
        error.message,
        DatabaseConnectionError.status!
      )
    );
  else if (
    error instanceof Error ||
    (error &&
      typeof error === "object" &&
      "status" in error &&
      "name" in error &&
      "message" in error)
  )
    next(
      new CustomError(
        error.message as string,
        error.name as string,
        "status" in error ? (error.status as number) || 500 : 500
      )
    );
  else next(new CustomError);
};
export const errorCast = (
  next: NextFunction,
  error: unknown,
  defaultError:IError
) => {
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientValidationError
  )
    next(ValidationError(error.message));
  else if (
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError
  )
    next(
      new CustomError(
        DatabaseConnectionError.name,
        error.message,
        DatabaseConnectionError.status!
      )
    );
  else if (
    error instanceof Error ||
    (error &&
      typeof error === "object" &&
      "status" in error &&
      "name" in error &&
      "message" in error)
  )
    next(
      new CustomError(
        error.message as string,
        error.name as string,
        "status" in error ? (error.status as number) || 500 : 500
      )
    );
  else next(new CustomError());
};



export const errorThrow = (error: unknown, defaultError: IError) => {
  if (error instanceof Error) throw error;
  else throw defaultError;
};
