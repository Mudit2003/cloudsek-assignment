import { _get, _delete, _post, _put } from './apiClient';
import IPost, { ICreatePost, IUpdatePost } from '../@types/post';
// import { error } from 'console';

const getAllPosts = async (): Promise<IPost[] | null> => {
    try {
        const response = await _get<IPost[]>("/posts");
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
};

const deletePost = async (postId: string): Promise<void> => {
    try {
        await _delete<IPost[]>(`/posts/${postId}`);
    } catch (error) {
        console.error("Error deleting posts:", error);
    }
};

const createPost = async (postBody: ICreatePost): Promise<IPost | null> => {
    try {
        const response = await _post<IPost>("/posts")
        return response.data
    } catch (error) {
        console.log("Error creating Post: ", error)
        return null
    }
}

const updatePost = async (postId: string, postBody: IUpdatePost): Promise<IPost | null> => {
    try {
        const response = await _put<IPost>(`/posts/${postId}`)
        return response.data
    } catch (error) {
        console.log("Error updating post: ", error)
        return null
    }
}

const getPost = async (postId: string): Promise<IPost | null> => {
    try {
        const response = await _get<IPost>(`/posts/${postId}`)
        return response.data
    } catch (error) {
        console.log("Error fetching post: ", error)
        return null
    }
}

export { getAllPosts, deletePost, createPost, updatePost, getPost };
