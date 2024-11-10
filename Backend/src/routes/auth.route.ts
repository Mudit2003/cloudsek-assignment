import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  emailVerificationController,
  loginController,
  logoutController,
  registerController,
  verifyOTPController,
} from "../controllers/auth.controller";
import { authenticateRequest } from "../middlewares/auth.middleware";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after a minute",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/login", loginLimiter, loginController);
router.post("/register", registerController);
router.post("/logout", authenticateRequest, logoutController);
router.post("/forgotPassword", loginLimiter, emailVerificationController);
router.post("/validateOtp", verifyOTPController);

export default router;
