import React, { useState } from "react";
import axios from "axios";
axios.defaults.headers.common["Content-Type"] = "application/json";

function ErrorTest() {
  const [errorInfo, setErrorInfo] = useState(null);

  const triggerError = async () => {
    try {
      await axios.get("/api/error");
    } catch (error) {
      if (error.response) {
        // 서버에서 반환된 스택 트레이스 출력
        setErrorInfo(error.response.data);
      } else {
        console.error("요청 중 오류 발생:", error.message);
      }
    }
  };

  return (
    <div>
      <h1>오류 테스트</h1>
      <button onClick={triggerError}>오류 발생</button>
      {errorInfo && (
        <div>
          <h2>오류 메시지:</h2>
          <p>{errorInfo.message}</p>
          <h2>스택 트레이스:</h2>
          <pre>{errorInfo.stack}</pre>
        </div>
      )}
    </div>
  );
}

export default ErrorTest;
