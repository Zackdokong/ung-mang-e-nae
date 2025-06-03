import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // supabase 클라이언트 경로 맞춰서
import Header from "../../components/header/Header"
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!email || !password || !nickname) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
  
    setLoading(true);
  
    try {
      console.log("회원가입 시작");
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      console.log("signUp 결과 data:", data);
      console.log("signUp 결과 error:", error);
  
      if (error) throw error;
  
      const userId = data?.user?.id || data?.id;
  
      console.log("가져온 userId:", userId);
  
      if (!userId) {
        throw new Error("유저 ID를 찾을 수 없습니다.");
      }
  
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: userId,
          nickname,
          created_at: new Date().toISOString(),
        },
      ]);
  
      if (dbError) throw dbError;
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패 에러:", error);
      const message = error?.message || JSON.stringify(error) || "알 수 없는 에러";
      alert(`회원가입 실패: ${message}`);
    } finally {
      console.log("회원가입 끝, 로딩 false로 변경");
      setLoading(false);
    }
  };
  

  return (
    <>
    <Header />
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>
      <form onSubmit={handleSignup} className={styles.form}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
        <p className={styles.loginLink}>
          이미 계정이 있나요?{" "}
          <Link to="/login" className={styles.link}>
            로그인
          </Link>
        </p>
      </form>
    </div>
    </>
  );
}

export default Signup;
