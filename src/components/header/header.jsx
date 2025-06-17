import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // 내가 만든 훅 경로 맞춰줘
import styles from "./Header.module.css";

function Header() {
  const { isLoggedIn, userName, nickName, favTeam, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <Link to="/" className={styles.logo}>
          엉망이네
        </Link>
      </div>
      <div className={styles.rightSection}>
        {isLoggedIn ? (
          <>
            <span className={styles.welcome}> {favTeam}❤️ {nickName}님👋</span>
            <Link to="/my-team" className={styles.button}>
              내 팀 설정
            </Link>
            <button className={styles.button} onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.button}>
              로그인
            </Link>
            <Link to="/signup" className={styles.button}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
