import React from "react";
import Post from "./Post";

function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return <p>게시글이 없습니다.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} {...post} /> // Post 컴포넌트에 데이터 전달
      ))}
    </div>
  );
}

export default PostList;
