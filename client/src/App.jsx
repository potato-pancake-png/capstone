import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // AuthProvider 추가
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ViewPost from "./pages/ViewPost";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import ErrorTest from "./pages/ErrorTest"; // ErrorTest 추가
import NotFound from "./pages/NotFound"; // NotFound 추가

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/posts/:id" element={<ViewPost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/error" element={<ErrorTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
