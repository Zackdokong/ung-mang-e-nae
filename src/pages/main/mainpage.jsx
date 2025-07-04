import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './Mainpage.module.css';
import Header from '../../components/header/header';
import * as constants from '../../constants/constants';

function MainPage() {
  const navigate = useNavigate();

  const handleEnterChat = (teamName) => {
    const slug = constants.teamSlugMap[teamName];
    if (!slug) {
      alert("알 수 없는 팀입니다.");
      return;
    }
    navigate(`/chatroom/${slug}`);
  };

  // 5개씩 두 줄로 나누기
  const firstRow = constants.teams.slice(0, 5);
  const secondRow = constants.teams.slice(5, 10);

  // 전체채팅방 버튼 따로
  const handleEnterAllChat = () => {
    navigate('/chatroom/all');
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>⚾️ 팀별 응원 채팅방</h1>
        <button
          className={`${styles.chatButton} ${styles.allChatButton}`}
          onClick={handleEnterAllChat}
        >
          전체 채팅방
        </button>
        <div className={styles.row}>
          {firstRow.map((team) => (
            <button
              key={team}
              className={styles.chatButton}
              onClick={() => handleEnterChat(team)}
            >
              {team}
            </button>
          ))}
        </div>
        <div className={styles.row}>
          {secondRow.map((team) => (
            <button
              key={team}
              className={styles.chatButton}
              onClick={() => handleEnterChat(team)}
            >
              {team}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default MainPage;
