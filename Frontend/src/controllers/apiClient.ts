import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://api.example.com';
// console.log("token", process.env.REACT_APP_BEARER_TOKEN)
const token = process.env.REACT_APP_BEARER_TOKEN as string;

const apiClient = axios.create({
    withCredentials: false,
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
});

export const setAuthToken = (token: string) => {
    // token 
    // there is a token already associated , if the token null authaxios headers token null 
    // generally you set the token into the axios instance 
    // for signing and authorization into backend 
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        console.log('authToken is null');
        delete apiClient.defaults.headers.common["Authorization"];
    }
};

const _get = async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
};

const _delete = async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
};

const _put = async <T>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
};

const _post = async <T>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
};

// Export API methods
export { _get, _delete, _put, _post };
