import { error } from "console";
import IError from "../interfaces/error.interface";

export const InvalidCredentialsError: IError = {
  name: `InvalidCredentialsError`,
  status: 401,
  message: "Invalid credentials",
};

export const UserNotAuthenticatedError: IError = {
  name: `UserNotAuthenticatedError`,
  status: 401,
  message: "User not authenticated",
};

export const AccessTokenMissingError: IError = {
  name: "AccessTokenMissingError",
  status: 401,
  message: "Access token is missing",
};

export const InvalidAccessTokenError: IError = {
  name: "InvalidAccessTokenError",
  status: 403,
  message: "Invalid or expired access token",
};

export const InvalidRefreshTokenError: IError = {
  name: "InvalidRefreshTokenError",
  status: 403,
  message: "Invalid or expired access token",
};

export const RefreshTokenMissingError: IError = {
  name: "RefreshTokenMissingError",
  status: 403,
  message: "Invalid refresh token",
};

export const UserNotFoundError: IError = {
  name: "UserNotFoundError",
  status: 404,
  message: "User not found",
};

export const EmailVerificationError: IError = {
  name: "EmailVerificationError",
  status: 400,
  message: "Email verification failed",
};

export const LogoutError = (error: Error): IError => ({
  name: "CanNotLogOut",
  status: 400,
  message: "Cannot Logout",
});

export const OTPValidationError: IError = {
  name: "OTPValidationError",
  status: 400,
  message: "Invalid OTP",
};

export const RegistrationError = (error: IError): IError => ({
  name: "Registration Error",
  status: 400,
  message: error.message,
});

export const TokenRefreshError = (error: Error): IError => ({
  name: "TokenRefreshError",
  status: 403,
  message: error.message,
});

export const PasswordChangeError: IError = {
  name: "PasswordChangeError",
  status: 400,
  message: "Password Change Error",
};
