export default interface IComment {
    authorId: string;
    parentCommentId?: string;
    content: string;
    mentions: string[];
    id?: string;
    replies?: IComment[];
}

export interface IAddComment {
    postId: string;
    content: string;
    authroId: string;
    parentCommentId?: string;
}
