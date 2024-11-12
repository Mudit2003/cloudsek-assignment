import { NextFunction, Request, Response } from "express";
import {
  login,
  logout,
  register,
  emailVerification,
  validateOTP,
} from "../services/auth.service";
import { IUserRequest } from "../interfaces/user.interface";
import { emailValidator } from "../validation/user.schema";

import {
  EmailVerificationError,
  InvalidCredentialsError,
  LogoutError,
  OTPValidationError,
  PasswordChangeError,
  RegistrationError,
  UserNotAuthenticatedError,
} from "../errors/auth.error";
import { updateUser, verifyUserEmail } from "../services/user.service";
import { decodeAccessToken, generateAccessToken } from "../utils/token.util";
import { errorCast, errorCastWithParams } from "../utils/error.util";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const user = await register(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    errorCastWithParams(next, error, RegistrationError);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const validateEmail = emailValidator.safeParse(email).success;
    if (!validateEmail || !password) {
      throw InvalidCredentialsError;
    }

    const response = await login(email, password);
    var { refreshToken, accessToken, user } = response;
    user.refreshToken = undefined;
    res.cookie("refreshToken", response.refreshToken, {
      maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "604800"),
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({ user, accessToken });
  } catch (error) {
    errorCast(next, error, InvalidCredentialsError);
  }
};

export const logoutController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw UserNotAuthenticatedError;
    }
    await logout(userId);
    res.status(204).send();
  } catch (error) {
    errorCastWithParams(next, error, LogoutError);
  }
};

export const emailVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await emailVerification(email);
    res.status(200).send("Email verification link sent");
  } catch (error) {
    errorCast(next, error, EmailVerificationError);
  }
};

export const verifyOTPController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    const isValid = await validateOTP(email, otp);
    if (isValid) {
      const user = await verifyUserEmail(email);
      const accessToken = generateAccessToken(user);
      res.setHeader("Authorization-Info", `Bearer ${accessToken}`);
      res.status(200).json({ message: "OTP is valid" });
    } else {
      throw OTPValidationError;
    }
  } catch (error) {
    errorCast(next, error, OTPValidationError);
  }
};

export const changePasswordController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = req.user;
    updateUser(user?.id!, { password });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    errorCast(next, error, PasswordChangeError);
  }
};
