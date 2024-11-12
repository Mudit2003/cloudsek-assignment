import axios, { AxiosResponse } from "axios";
import IUser from "../@types/user";

// interface UserInfo {
//     id: number;
//     name: string;
//     email: string;
// }

console.log(process.env)

const fetchUserInfo = async (): Promise<IUser | null> => {
    try {
        const response: AxiosResponse<IUser> = await axios.get(process.env.REACT_APP_USER as string);
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

console.log(process.env.REACT_APP_USER);

const userInfoPromise = fetchUserInfo();
userInfoPromise.then(data => {
    console.log(data);
});

export { userInfoPromise };
