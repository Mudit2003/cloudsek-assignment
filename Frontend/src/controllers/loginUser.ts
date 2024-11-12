import { _post } from './apiClient';
import IUser from '../@types/user';

interface LoginResponse {
    token: string;
    user: IUser;
}

interface LoginRequest {
    username: string;
    password: string;
}

const loginUser = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    try {
        const response = await _post<LoginResponse>("/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in: ", error);
        return null;
    }
};

// Example usage
const credentials: LoginRequest = {
    username: "exampleUser",
    password: "examplePassword"
};

const loginPromise = loginUser(credentials);
loginPromise.then(data => {
    if (data) {
        console.log("Login successful:", data);
    } else {
        console.log("Login failed.");
    }
});

export { loginUser };
