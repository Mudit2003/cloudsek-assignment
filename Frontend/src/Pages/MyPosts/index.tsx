import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's snow theme CSS
import "./MyPosts.css";
import IPost from "../../@types/post";
import {
  deletePost,
  getAllPosts,
  updatePost,
} from "../../controllers/handlePosts";
import { useAuth } from "../../contexts/authContext";

// interface Post {
//   id: number;
//   title: string;
//   content: string;
//   edited: boolean;  // New property to track if post is edited
// }

const MyPosts: React.FC = () => {
  // const [posts, setPosts] = useState<IPost[]>([
  //   {
  //     id: 1,
  //     title: "My First Post",
  //     content: "This is the content of my first post.",
  //     edited: false,
  //   },
  //   {
  //     id: 2,
  //     title: "My Second Post",
  //     content: "This is the content of my second post.",
  //     edited: false,
  //   },
  //   {
  //     id: 3,
  //     title: "My Third Post",
  //     content: "This is the content of my third post.",
  //     edited: false,
  //   },
  //   {
  //     id: 4,
  //     title: "My Fourth Post",
  //     content: "This is the content of my fourth post.",
  //     edited: false,
  //   },
  //   {
  //     id: 5,
  //     title: "My Fifth Post",
  //     content: "This is the content of my fifth post.",
  //     edited: false,
  //   },
  //   {
  //     id: 6,
  //     title: "My Sixth Post",
  //     content: "This is the content of my sixth post.",
  //     edited: false,
  //   },
  //   {
  //     id: 7,
  //     title: "My Seventh Post",
  //     content: "This is the content of my seventh post.",
  //     edited: false,
  //   },
  //   {
  //     id: 8,
  //     title: "My Eighth Post",
  //     content: "This is the content of my eighth post.",
  //     edited: false,
  //   },
  //   {
  //     id: 9,
  //     title: "My Ninth Post",
  //     content: "This is the content of my ninth post.",
  //     edited: false,
  //   },
  //   {
  //     id: 10,
  //     title: "My Tenth Post",
  //     content: "This is the content of my tenth post.",
  //     edited: false,
  //   },
  //   // Add more posts here if needed
  // ]);

  const [posts, setPosts] = useState<IPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<IPost | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // Display 3 posts per page

  const userData = useAuth();
  const currentUsername = userData.user?.username;

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getAllPosts();
      if (fetchedPosts) {
        setPosts(
          fetchedPosts.filter((post) => post.authorId === currentUsername)
        );
      }
    };

    fetchPosts();
  }, []);

  const handleEditClick = (post: IPost) => {
    setIsEditing(true);
    setCurrentPost(post);
    setEditedContent(post.content);
    updatePost(post.id ? post.id : "", {
      title: post.content.substring(0, 10),
      content: editedContent,
      mentions: post.mentions,
    });
  };

  const handleDeleteClick = (postId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      setPosts(posts.filter((post) => post.id !== postId));
      deletePost(postId);
    }
  };

  const handleSaveChanges = () => {
    if (currentPost) {
      setPosts(
        posts.map((post) =>
          post.id === currentPost.id
            ? {
                ...post,
                content: editedContent, // Append "Edited" text
                edited: true, // Mark as edited
              }
            : post
        )
      );
      setIsEditing(false);
      setCurrentPost(null);
      setEditedContent("");
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="my-posts-container">
      <h2>My Posts</h2>

      <div className="post-cards-container">
        {currentPosts.length === 0 ? (
          <p className="empty-message">You have no posts yet.</p>
        ) : (
          currentPosts.map((post) => (
            <div key={post.id} className="post-card">
              <strong>{post.title}</strong>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>{" "}
              {/* Render rich text content */}
              {post.edited && <span className="edited-tag">[Edited]</span>}{" "}
              {/* Display the "Edited" label */}
              <div className="post-card-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(post)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteClick(post.id || "")}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditing && currentPost && (
        <div className="edit-post-form">
          <h3>Edit Post</h3>
          <ReactQuill
            value={editedContent}
            onChange={setEditedContent}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link"],
                ["image"],
                ["blockquote"],
                [{ direction: "rtl" }],
                [{ color: [] }, { background: [] }],
                [{ script: "sub" }, { script: "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ size: ["small", false, "large", "huge"] }],
                ["clean"],
              ],
            }}
          />
          <div className="edit-buttons">
            <button onClick={handleSaveChanges} className="save-button">
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyPosts;
