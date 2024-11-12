import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import IPost from "../../@types/post";
import IComment from "../../@types/comment";

import "./PostPage.css";
import { getAllPosts } from "../../controllers/handlePosts";
import { useAuth } from "../../contexts/authContext";

// interface Comment {
//   id: string;
//   text: string;
//   author: string;
//   parentId?: string;
//   replies?: Comment[];
// }

// interface Post {
//   id: string;
//   content: string;
//   author: string;
//   comments: Comment[];
// }

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([
    // Example posts
    {
      id: "post1",
      title: "Post 1",
      content: "This is the first post.",
      authorId: "Author1",
      comments: [],
      mentions: [],
    },
    {
      id: "post2",
      title: "Post 2",
      content: "Another post!",
      authorId: "Author2",
      comments: [],
      mentions: [],
    },
    {
      id: "post3",
      title: "Post 3",
      content: "Testing pagination on comments.",
      authorId: "Author3",
      comments: [],
      mentions: [],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const getData = await getAllPosts();
      if (getData) {
        setPosts(getData);
      } else {
        setPosts([]);
      }
    };

    fetchData();
  }, []);

  const postsPerPage = 2;
  const commentsPerPage = 2; // Comments per page
  const [currentPage, setCurrentPage] = useState(1);
  const [commentPage, setCommentPage] = useState<{ [key: string]: number }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [replyTo, setReplyTo] = useState<{ [key: string]: string | null }>({});

  // Display current posts based on the page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const userData = useAuth();

  const addComment = (postId: string, text: string, parentId?: string) => {
    if (!text.trim()) return;

    const newComment: IComment = {
      id: Math.random().toString(36).substr(2, 9),
      content: text,
      authorId: userData.user?.username ? userData.user?.username : "",
      parentCommentId: parentId,
      mentions: [],
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: parentId
                ? post.comments &&
                  post.comments.map((comment) =>
                    comment.id === parentId
                      ? {
                          ...comment,
                          replies: [...(comment.replies || []), newComment],
                        }
                      : comment
                  )
                : post.comments && [...post.comments, newComment],
            }
          : post
      )
    );

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    setReplyTo((prev) => ({ ...prev, [postId]: null }));
  };

  const renderComments = (
    comments: IComment[],
    postId: string,
    depth: number = 0
  ) => {
    const currentCommentPage = commentPage[postId] || 1;
    const startIndex = (currentCommentPage - 1) * commentsPerPage;
    const currentComments = comments.slice(
      startIndex,
      startIndex + commentsPerPage
    );

    return (
      <>
        {currentComments.map((comment) => (
          <div key={comment.id} style={{ marginLeft: depth * 20 }}>
            <div>
              <strong>{comment.authorId}</strong>:{" "}
              <span dangerouslySetInnerHTML={{ __html: comment.content }} />
              <button
                onClick={() =>
                  setReplyTo((prev) =>
                    prev
                      ? { ...prev, [postId]: comment.id ? comment.id : null }
                      : { x: "none" }
                  )
                }
              >
                Reply
              </button>
            </div>
            {comment.replies &&
              renderComments(comment.replies, postId, depth + 1)}
          </div>
        ))}
        {comments.length > commentsPerPage && (
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(comments.length / commentsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() =>
                    setCommentPage((prev) => ({ ...prev, [postId]: i + 1 }))
                  }
                  className={i + 1 === currentCommentPage ? "active" : ""}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}
      </>
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const socket = io(process.env.REACT_APP_SOCKET_URL);

  useEffect(() => {
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [...prevPosts, newPost]);
    });

    socket.on("newComment", ({ postId, comment }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments && [...post.comments, comment],
              }
            : post
        )
      );
    });

    socket.on("newReply", ({ postId, commentId, reply }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments
                ? post.comments.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          replies: [...(comment.replies || []), reply],
                        }
                      : comment
                  )
                : [],
            };
          }
          return post;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <h2>Posts</h2>
      {currentPosts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "20px 0",
          }}
        >
          <h3>{post.authorId}</h3>
          <p>{post.content}</p>
          <div>
            <h4>Comments</h4>
            {post.comments && post.id && renderComments(post.comments, post.id)}

            <ReactQuill
              value={post.id ? commentText[post.id] : ""}
              onChange={(value) =>
                setCommentText((prev) =>
                  post.id ? { ...prev, [post.id]: value } : {}
                )
              }
              placeholder="Write a comment..."
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              style={{ marginTop: "10px" }}
            />
            <button
              onClick={() =>
                post.id &&
                addComment(
                  post.id,
                  commentText[post.id],
                  replyTo[post.id] || undefined
                )
              }
              style={{ marginTop: "10px" }}
            >
              {post.id && replyTo[post.id] ? "Reply" : "Comment"}
            </button>
          </div>
        </div>
      ))}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(posts.length / postsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default PostsPage;
