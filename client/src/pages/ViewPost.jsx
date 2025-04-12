import React, { useEffect, useState } from "react";
import "./ViewPost.css";
import Nav from "../components/Nav"; // Nav 컴포넌트 추가
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가
axios.defaults.headers.common["Content-Type"] = "application/json";

function ViewPost() {
  const { id } = useParams();
  const location = useLocation(); // URL 변경 감지
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 마운트 시 게시글 데이터 가져오기
    const fetchPost = async () => {
      try {
        setLoading(true); // 로딩 상태 활성화
        const response = await axios.get(`/api/posts/${id}`); // Axios로 GET 요청

        setPost(response.data.post);
      } catch (err) {
        if (err.response?.status === 404) {
          alert("게시글을 찾을 수 없습니다.");
          navigate("/", { replace: true }); // 홈페이지로 이동
        } else if (err.response?.status === 403) {
          alert("게시글을 불러오는 데 실패했습니다. 권한이 없습니다.");
          navigate("/", { replace: true }); // 홈페이지로 이동
        } else {
          setError(err.message || "게시글을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false); // 로딩 상태 비활성화
      }
    };

    fetchPost();
  }, [id, location.key]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error}</p>;
  if (!post) return <p>게시글이 없습니다.</p>;

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "정말로 이 게시글을 삭제하시겠습니까?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.post(`/api/posts/${id}/delete/`); // Axios로 POST 요청

      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert(
        error.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div>
      <Nav />
      <main className="post-main">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-meta">작성자: {post.username}</p>

        {/* XSS 시나리오 구현을 위해 dangerouslySetInnerHTML 사용 */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="post-actions">
          <Link to={`/posts/${id}/edit`} className="post-edit-button">
            수정
          </Link>
          <form onSubmit={handleDelete}>
            <input type="hidden" name="id" value={id} />
            <button type="submit" className="post-delete-button">
              삭제
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ViewPost;
