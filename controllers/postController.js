const {
  findAllPosts,
  findPostById,
  searchPosts,
  createPost,
  editPost,
  removePost,
} = require("../services/postService");

async function getAllPostsHandler(req, res) {
  try {
    const results = await findAllPosts();

    if (results.length === 0) {
      return res.status(200).json({ message: "게시글이 없습니다." });
    }
    res.json({ posts: results });
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

async function createPostHandler(req, res) {
  const { username, title, content } = req.body;

  if (!username || !title || !content) {
    return res.status(400).json({
      message: "아이디, 제목, 내용은 필수입니다.",
    });
  }

  try {
    const results = await createPost(username, title, content);

    res.status(201).json({
      id: results.insertId,
      username,
      title,
      content,
    });
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

async function getPostByIdHandler(req, res) {
  const { id } = req.params;

  try {
    const post = await findPostById(id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "해당 게시글을 찾을 수 없습니다." });
    }
    res.send({ post });
  } catch (error) {
    console.error("게시글 검색 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

async function updatePostHandler(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const results = await editPost(id, title, content);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "해당 게시글을 찾을 수 없습니다." });
    }

    res.json({ message: "게시글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

async function deletePostHandler(req, res) {
  const { id } = req.params;

  try {
    const results = await removePost(id);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "해당 게시글을 찾을 수 없습니다." });
    }

    res.json({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

async function searchPostsHandler(req, res) {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: "검색어를 입력하세요." });
  }

  try {
    const posts = await searchPosts(search);

    if (posts.length === 0) {
      return res.status(404).json({ message: "검색 결과가 없습니다." });
    }

    res.json({ posts });
  } catch (error) {
    console.error("게시글 검색 중 오류 발생:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

module.exports = {
  getAllPostsHandler,
  createPostHandler,
  getPostByIdHandler,
  updatePostHandler,
  deletePostHandler,
  searchPostsHandler,
};
