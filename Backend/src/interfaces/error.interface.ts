import { error } from "console";
import { NextFunction } from "express";

export default interface IError extends Error {
  status?: number;
}

