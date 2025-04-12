import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // Axios 추가

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // 로그인 상태
  const [user, setUser] = useState(null); // 사용자 정보

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.post(
          "/api/check-session",
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // 세션 포함
          }
        );

        if (res.status === 200) {
          const data = res.data;
          if (data.loggedIn) {
            setIsLoggedIn(true);
            setUser(data.username);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
