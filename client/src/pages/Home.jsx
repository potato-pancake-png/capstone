import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../AuthContext"; // AuthContext 가져오기
import PostList from "../components/PostList"; // PostList 가져오기
import Nav from "../components/Nav"; // Nav 가져오기
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가
axios.defaults.headers.common["Content-Type"] = "application/json";

function CreatePost() {
  const { user } = useContext(AuthContext); // AuthContext에서 사용자 정보 가져오기
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  axios.defaults.headers.common["Content-Type"] = "application/json";

  // 전체 게시글 가져오기
  const fetchPosts = async () => {
    try {
      setLoading(true); // 로딩 상태 활성화
      const response = await axios.post("/api/posts", { action: "getPosts" }); // Axios로 POST 요청
      setPosts(response.data.posts); // 게시글 목록 설정
    } catch (err) {
      setError(err.message); // 에러 상태 설정
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 검색어 기반 게시글 가져오기
  const fetchPostsBySearch = async (query) => {
    try {
      setLoading(true); // 로딩 상태 활성화
      const response = await axios.get(
        `/api/posts?search=${encodeURIComponent(query)}`
      ); // Axios로 GET 요청
      setPosts(response.data.posts); // 검색 결과로 게시글 목록 설정
    } catch (err) {
      setError(err.message); // 에러 상태 설정
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 게시글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const content = e.target.content.value;

    if (!title || !content) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("/api/create", {
        username: user,
        title,
        content,
      }); // Axios로 POST 요청

      if (response.status === 403) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        navigate("/login"); // 로그인 페이지로 리다이렉트
        return;
      }

      setPosts((prevPosts) => [...prevPosts, response.data]); // 새 게시글 추가
      alert("게시글이 성공적으로 작성되었습니다.");
      e.target.reset(); // 입력 필드 초기화
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      fetchPosts(); // 검색어가 없으면 전체 게시글 가져오기
    } else {
      fetchPostsBySearch(searchQuery); // 검색어 기반 게시글 가져오기
    }
  };

  // 컴포넌트 마운트 시 전체 게시글 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

  // PostList를 메모이제이션하여 불필요한 리렌더링 방지
  const memoizedPostList = useMemo(() => {
    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러: {error}</p>;
    return <PostList posts={posts} />;
  }, [posts, loading, error]);

  return (
    <div>
      <Nav />
      <main className="main-container">
        {/* 검색 섹션 */}
        <section className="section">
          <form onSubmit={handleSearch} className="home-form-container">
            <input
              type="text"
              placeholder="검색어 입력"
              className="home-form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="home-form-button">
              검색
            </button>
          </form>
        </section>

        {/* 게시글 목록 */}
        <section className="section">
          <div>{memoizedPostList}</div>
        </section>

        {/* 게시글 작성 */}
        <section className="section">
          <h2 className="section-title">게시글 작성</h2>
          <form onSubmit={handleSubmit} className="create-post-form">
            <input
              type="text"
              name="title"
              placeholder="제목"
              className="create-post-input"
              required
            />
            <textarea
              name="content"
              placeholder="내용"
              rows="4"
              className="create-post-textarea"
              required
            ></textarea>
            <button type="submit" className="create-post-button">
              작성
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreatePost;
