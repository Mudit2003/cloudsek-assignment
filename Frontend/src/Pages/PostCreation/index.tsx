import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostCreation.css";
import { useNavigate } from "react-router-dom"; // for navigation
import { useAuth } from "../../contexts/authContext";
import { createPost } from "../../controllers/handlePosts";
import { ICreatePost } from "../../@types/post";
// import { useAuth } from "../../contexts/authContext";

interface PostCreationProps {
  username: string;
}

const PostCreation: React.FC<PostCreationProps> = ({ username }) => {
  const [postContent, setPostContent] = useState("");
  const navigate = useNavigate();

  const getData = useAuth();
  if (getData) {
    const un = getData.user?.username;
    console.log(un);
    if (un) {
      username = un;
    }
  }

  const handleChange = (value: string) => {
    setPostContent(value);
  };

  const handleSubmit = () => {
    console.log("Post content:", postContent);
    // Add post submission logic here
    const newPost: ICreatePost = {
      title: postContent.substring(0, 15),
      content: postContent,
      username: getData.user?.username
        ? getData.user?.username
        : "undefined user",
    };
    // const newPost = createPost()
    const createdPost = createPost(newPost);
    console.log("New Post Created: ", createdPost);
  };

  const handleViewAllPosts = () => {
    navigate("/myposts"); // Navigates to "MyPosts" page
  };

  return (
    <div className="post-creation-container">
      <div className="header">
        <h2 className="welcome-message">Welcome, {username} 😊</h2>
        <button onClick={handleViewAllPosts} className="view-posts-button">
          View All Posts
        </button>
      </div>

      <h3>Create a Post</h3>
      <ReactQuill
        value={postContent}
        onChange={handleChange}
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
      <button onClick={handleSubmit} className="button">
        Post
      </button>
    </div>
  );
};

export default PostCreation;
