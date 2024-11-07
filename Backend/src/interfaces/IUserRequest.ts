import { Request } from 'express';
import { IUser } from '../models/User';

export interface IUserRequest extends Request {
    // will be passed from user interface 
    headers: { authorization?: string; Authorization?: string };
    cookies: { authToken?: string };
    user?: IUser;
}
