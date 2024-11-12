import { _get, _post } from './apiClient';
import IUser from '../@types/user';

const getAllUsers = async (): Promise<IUser[] | null> => {
    try {
        const response = await _get<IUser[]>("/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
};

const createUser = async (username: string): Promise<void> => {
    try {
        await _post<{ username: string }>("/users", { username: username })
    } catch (error) {
        console.log("Error creating user")
    }
}

export { getAllUsers, createUser }