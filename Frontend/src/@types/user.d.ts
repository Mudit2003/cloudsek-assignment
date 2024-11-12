import IPost from "./post";

export default interface IUser {
    username: string;
    id?: string;
    email: string;
    passsword?: string;
    isVerified: boolean;
    posts: IPost[];
}

interface LoginResponse {
    accessToken: string;
    user: IUser;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterResponse {
    token: string;
    user: IUser;
}

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse }