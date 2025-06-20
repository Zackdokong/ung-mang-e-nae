import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Header from "../../components/header/header";
import styles from "./Signup.module.css";
import * as constants from "../../constants/constants";

const teams = constants.teams;

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [favTeam, setFavTeam] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !nickname || !favTeam) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      // 1. 닉네임 중복 체크
      const { data: nicknameRows, error: nicknameError } = await supabase
        .from("users")
        .select("id")
        .eq("nickname", nickname)
        .limit(1);

      if (nicknameError) throw nicknameError;
      if (nicknameRows && nicknameRows.length > 0) {
        alert("이미 존재하는 닉네임입니다. 다른 닉네임을 사용해 주세요.");
        setLoading(false);
        return;
      }

      // 2. 회원가입 진행
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const userId = data?.user?.id || data?.id;
      if (!userId) throw new Error("유저 ID를 찾을 수 없습니다.");

      const { error: dbError } = await supabase.from("users").insert([
        {
          id: userId,
          nickname,
          team: favTeam,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) throw dbError;
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패 에러:", error);
      alert(`회원가입 실패: ${error.message || "알 수 없는 에러"}`);
    } finally {
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
          <select
            value={favTeam}
            onChange={(e) => setFavTeam(e.target.value)}
            className={styles.select}
            required
            disabled={loading}
          >
            <option value="">팀 선택</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
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
