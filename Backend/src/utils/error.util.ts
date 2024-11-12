import { NextFunction } from "express";
import IError from "../interfaces/error.interface";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  DatabaseConnectionError,
  ValidationError,
} from "../errors/config.error";

export const errorCastWithParams = (
  next: NextFunction,
  error: unknown | any,
  defaultError: (error: Error) => IError
) => {
  console.log("Errorcast", error.name);
  if (error instanceof Error && "status" in error) next(error);
  else {
    if (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientValidationError
    )
      next(ValidationError(error.message));
    else if (
      error instanceof PrismaClientInitializationError ||
      error instanceof PrismaClientRustPanicError
    )
      next(DatabaseConnectionError);
    else if (error instanceof Error) next(defaultError(error));
    else next(error);
  }
};

export const errorCast = (
  next: NextFunction,
  error: unknown | any,
  defaultError: IError
) => {
  console.log("Errorcast", error.name);
  if (error instanceof Error && "status" in error) next(error);
  else {
    if (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientValidationError
    )
      next(ValidationError(error.message));
    else if (
      error instanceof PrismaClientInitializationError ||
      error instanceof PrismaClientRustPanicError
    )
      next(DatabaseConnectionError);
    else if (error instanceof Error) next(defaultError);
    else next(error);
  }
};

export const errorThrow = (error: unknown, defaultError: IError) => {
  if (error instanceof Error) throw error;
  else throw defaultError;
};
