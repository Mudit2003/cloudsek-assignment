import { _post } from "./apiClient";
import IUser, { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../@types/user";

const loginUser = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    try {
        console.log(credentials)
        const response = await _post<LoginResponse>("/auth/login", credentials);
        // console.log(response.data, response.headers)
        const { user, accessToken } = response.data
        return { user, accessToken }
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
};

const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse | null> => {
    try {
        const response = await _post<RegisterResponse>("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
};

const verifyEmail = async (email: string): Promise<void> => {
    try {
        await _post("/auth/verifyEmail", email)
    } catch (error) {
        console.log("Error verifying email: ", error)
    }
}

const validateOtp = async (email: string, otp: string): Promise<{ message: string | null }> => {
    try {
        const response = await _post<{ message: string | null }>("/auth/validateOtp", { email, otp })
        return response.data
    } catch (error) {
        console.log("Error validating OTP: ", error)
        return { message: null }
    }
}

const updatePassword = async (password: string): Promise<{ message: string | null }> => {
    try {
        const response = await _post<{ message: string | null }>("/auth/updatePassword", { password })
        return response.data
    } catch (error) {
        console.log("Error updating password: ", error)
        return { message: null }
    }
}

export { loginUser, registerUser, verifyEmail, updatePassword, validateOtp }