// Using a reply schema is not required in such a small scale application but with scalability demonstration in mind I am using a seperate one

export interface IReply {
    postId: string;
    commentId: string;
    content: string;
    authorId: string;
    mentions: string[];
    createdAt: Date;
    updatedAt: Date;
}