import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../../components/header/header";
import { supabase } from "../../supabaseClient";

function Login() {
  const navigate = useNavigate();
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일 정규식
  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!idOrEmail || !password) {
      alert("이메일(또는 닉네임)과 비밀번호를 입력해 주세요.");
      return;
    }

    let emailToUse = idOrEmail;

    // 만약에 입력이 이메일이 아니라면(닉네임이면)
    if (!isEmail(idOrEmail)) {
      // 닉네임 → 이메일로 변환
      const { data, error } = await supabase
        .from("users")
        .select("id, email")
        .eq("nickname", idOrEmail)
        .single();

      if (error || !data?.email) {
        alert("존재하지 않는 닉네임입니다.");
        return;
      }
      emailToUse = data.email;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) throw error;
      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
    } catch (error) {
      alert("로그인에 실패했습니다. 아이디(닉네임)/이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>로그인</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="text"
            placeholder="이메일 또는 닉네임"
            value={idOrEmail}
            onChange={(e) => setIdOrEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            로그인
          </button>
          <p className={styles.signupLink}>
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className={styles.link}>
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
