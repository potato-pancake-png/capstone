import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext"; // AuthContext 가져오기
import PostList from "../components/PostList"; // PostList 가져오기
import Nav from "../components/Nav"; // Nav 가져오기
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가
axios.defaults.headers.common["Content-Type"] = "application/json";

function CreatePost() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 전체 게시글 가져오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/posts/fetchposts", {
        action: "getPosts",
      });
      setPosts(response.data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색어 기반 게시글 가져오기
  const fetchPostsBySearch = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts?search=${query}`);
      setPosts(response.data.posts); // posts 받아오면 바로 상태 업데이트
      setError(null); // 에러 초기화
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 500)
      ) {
        setPosts([]); // 검색 결과 없으면 posts를 빈 배열로
        setError("게시글이 없습니다");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
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
      const response = await axios.post("/api/posts", {
        username: user,
        title,
        content,
      });

      setPosts((prevPosts) => [...prevPosts, response.data]);
      alert("게시글이 성공적으로 작성되었습니다.");
      e.target.reset();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
        return;
      }
      setError("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      fetchPosts();
    } else {
      fetchPostsBySearch(searchQuery);
    }
  };

  // 컴포넌트 마운트 시 전체 게시글 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

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
          <div>
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <PostList posts={posts} />
            )}
          </div>
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
