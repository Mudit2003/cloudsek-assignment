// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import {
  login,
  logout,
  register,
  emailVerification,
  validateOTP,
} from "../services/auth.service";
import { IUserRequest } from "../interfaces/user.interface";
import userSchema, { emailValidator } from "../validation/user.schema";

export const registerController = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const { username, email, password } = req.body;

    const user = await register(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateEmail = emailValidator.safeParse(email).success;
    if (!validateEmail || !password) {
      res.status(400).json({ error: "Bad Credential" });
      return;
    }

    const tokens = await login(email, password);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const logoutController = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    await logout(userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const emailVerificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    await emailVerification(email);
    res.status(200).send("Email verification link sent");
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const verifyOTPController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const isValid = await validateOTP(email, otp);
    if (isValid) {
      res.status(200).json({ message: "OTP is valid" });
    } else {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const verifyOTPAndChangePasswordController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const isValid = await validateOTP(email, otp);
    if (isValid) {
      res.status(200).json({ message: "OTP is valid" });
    } else {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    await emailVerification(email);
    res.status(200).send("Password link sent");
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

