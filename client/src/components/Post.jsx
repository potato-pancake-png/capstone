import React from "react";
import "./Post.css"; // 스타일 추가
import { Link } from "react-router-dom";

function Post({ id, title, username }) {
  return (
    <div className="post-container">
      <div className="post-meta">
        <Link className="post-id" to={`/posts/${id}`}>
          [{id}]: {title}
        </Link>
        <h1 className="post-username"> - {username}</h1>
      </div>
    </div>
  );
}

export default Post;
