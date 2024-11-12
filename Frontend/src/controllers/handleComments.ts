import { _get, _post, _put, _delete } from './apiClient';
import IComment, { IAddComment } from '../@types/comment';

const COMMENTS_ENDPOINT = '/comments';

export const getComments = async (postId: string): Promise<IComment[]> => {
    try {
        const response = await _get<IComment[]>(`${COMMENTS_ENDPOINT}/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching comments for post:", error);
        return [];
    }
};

export const addComment = async (data: IAddComment): Promise<IComment | null> => {
    try {
        const response = await _post<IComment>(`${COMMENTS_ENDPOINT}`, data);
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
};

export const updateComment = async (commentId: string, updatedComment: Partial<IComment>): Promise<IComment | null> => {
    try {
        const response = await _put<IComment>(`${COMMENTS_ENDPOINT}/${commentId}`, updatedComment);
        return response.data;
    } catch (error) {
        console.error("Error updating comment:", error);
        return null;
    }
};

export const deleteComment = async (commentId: string): Promise<void> => {
    try {
        await _delete(`${COMMENTS_ENDPOINT}/${commentId}`);
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
};

export const addReply = async (postId: string, commentId: string, reply: Omit<IComment, 'id'>): Promise<IComment | null> => {
    try {
        const response = await _post<IComment>(`${COMMENTS_ENDPOINT}/post/${postId}/comments/${commentId}/replies`, reply);
        return response.data;
    } catch (error) {
        console.error("Error adding reply:", error);
        return null;
    }
};

// export { fetchCommentsForPost, addComment, updateComment, deleteComment, addReply };
