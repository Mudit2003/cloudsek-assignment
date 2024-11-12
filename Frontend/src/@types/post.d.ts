import { IComment } from "./comment";

export default interface IPost {
    authorId: string;
    content: string;
    title: string;
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    comments?: IComment[];
    mentions: string[];
    edited?: boolean;
}

export interface ICreatePost {
    title: string;
    content: string;
    username: string;
}

export interface IUpdatePost {
    title?: string;
    content?: string;
    mentions?: string[];
}

