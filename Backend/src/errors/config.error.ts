// src/errors/customErrors.ts
import IError from '../interfaces/error.interface';


export const DatabaseConnectionError: IError = {
  name: 'DatabaseConnectionError',
  status: 500,
  message: 'Failed to connect to the database',
};

export const ValidationError = (message: string): IError => ({
  name: 'ValidationError',
  status: 400,
  message,
});

export const ResourceNotFoundError = (resource: string): IError => ({
  name: 'ResourceNotFoundError',
  status: 404,
  message: `${resource} not found`,
});

export const PermissionDeniedError: IError = {
  name: 'PermissionDeniedError',
  status: 403,
  message: 'Permission denied',
};

export const RateLimitExceededError: IError = {
  name: 'RateLimitExceededError',
  status: 429,
  message: 'Rate limit exceeded',
};
