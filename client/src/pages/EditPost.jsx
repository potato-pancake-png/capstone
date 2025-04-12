import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가
import "./EditPost.css"; // 스타일 추가
import Nav from "../components/Nav";
axios.defaults.headers.common["Content-Type"] = "application/json";

function EditPost() {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 내용 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${id}`); // Axios로 GET 요청
        setTitle(response.data.post.title);
        setContent(response.data.post.content);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          navigate("/login", { replace: true }); // 로그인 페이지로 이동
        } else {
          setError(err.message || "게시글을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // 게시글 수정 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/posts/${id}/edit`, {
        title,
        content,
      }); // Axios로 POST 요청

      alert("게시글이 성공적으로 수정되었습니다.");
      navigate(`/posts/${id}`, { replace: true }); // 수정 후 게시글 상세 페이지로 이동
    } catch (err) {
      console.error("게시글 수정 중 오류 발생:", err);
      alert(
        err.response?.data?.message || "게시글 수정 중 오류가 발생했습니다."
      );
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      <Nav />
      <main className="edit-post-main-container">
        <h1 className="edit-post-title">게시글 수정</h1>
        <form onSubmit={handleSubmit} className="edit-post-form">
          <div>
            <label htmlFor="title" className="edit-post-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="edit-post-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="edit-post-label">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              className="edit-post-textarea"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="edit-post-button">
            수정
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditPost;
