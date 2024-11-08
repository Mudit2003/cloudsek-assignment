import { Request } from "express";

export interface IUser{
    id? : string, 
    username: string, 
    posts?: [string],
    comments?: [string] 
}


export interface IUserRequest extends Request {
    // will be passed from user interface 
    headers: { authorization?: string; Authorization?: string };
    cookies: { authToken?: string };
    user?: IUser;
}