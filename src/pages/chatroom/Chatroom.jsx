import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../../components/header/header';
import styles from './ChatRoom.module.css';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../supabaseClient';

function ChatRoom() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, nickName } = useAuth();

  const [roomId, setRoomId] = useState(null);
  const [roomTitle, setRoomTitle] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 채팅방 ID 가져오기
  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("id, title")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setRoomId(data.id);
        setRoomTitle(data.title);
      }
    };

    fetchRoom();
  }, [slug]);

  // 메시지 조회 및 구독
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleSend = async () => {
    if (!input.trim() || !roomId || !user) return;

    await supabase.from("chat_messages").insert([
      {
        room_id: roomId,
        user_id: user.id,
        content: input
      }
    ]);

    setInput("");
  };

  return (
    <>
      <Header />
      <div className={styles.chatRoomContainer}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>←</button>
          <h2 className={styles.title}>{roomTitle} 응원 채팅방</h2>
        </div>

        <div className={styles.chatArea}>
          {messages.map((msg) => {
            const isMine = msg.user_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`${styles.message} ${isMine ? styles.myMessage : styles.otherMessage}`}
              >
                <span className={styles.sender}>{isMine ? "나" : msg.user_id.slice(0, 5)}</span>
                <div className={styles.text}>{msg.content}</div>
              </div>
            );
          })}
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
