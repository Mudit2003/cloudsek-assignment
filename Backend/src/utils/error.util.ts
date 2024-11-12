import { NextFunction } from "express";
import IError from "../interfaces/error.interface";

export const errorCastWithParams = (
  next: NextFunction,
  error: unknown | any,
  defaultError: (error: Error) => IError
) => {
  if (error instanceof Error && "status" in error) next(error);
  else if (error instanceof Error) next(defaultError(error));
  else next(error);
};

export const errorCast = (
  next: NextFunction,
  error: unknown | any,
  defaultError: IError
) => {
  console.log("Errorcast");
  if (error instanceof Error && "status" in error) next(error);
  else if (error instanceof Error) next(defaultError);
  else next(error);
};
