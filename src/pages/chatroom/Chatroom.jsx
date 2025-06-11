import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../../components/header/header';
import styles from './ChatRoom.module.css';

function ChatRoom() {
  const { team } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "나", // 추후 로그인 연동 시 닉네임으로 교체
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <>
      <Header />
      <div className={styles.chatRoomContainer}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>←</button>
          <h2 className={styles.title}>{team} 응원 채팅방</h2>
        </div>

        <div className={styles.chatArea}>
          {messages.map((msg) => (
            <div key={msg.id} className={styles.message}>
              <strong>{msg.sender}</strong>: {msg.text}
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className={styles.input}
          />
          <button onClick={handleSend} className={styles.sendButton}>전송</button>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
