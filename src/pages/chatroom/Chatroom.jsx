import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import styles from "./ChatRoom.module.css";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../supabaseClient";

function ChatRoom() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, favTeam } = useAuth();

  const [roomId, setRoomId] = useState(null);
  const [roomTitle, setRoomTitle] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null); // 👈 맨 아래 ref 추가

  if (user === undefined) {
    return <div>로딩 중...</div>;
  }

  if (!isLoggedIn) {
    navigate("../../login");
  }

  const formatTime = (iso) => {
    const date = new Date(iso);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // 채팅방 정보 불러오기
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

  // 메시지 로드 + 실시간 구독
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data: messagesData, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error || !messagesData) {
        console.error("메시지 로드 실패:", error);
        setMessages([]);
        return;
      }

      const messagesWithNicknames = await Promise.all(
        messagesData.map(async (msg) => {
          const { data: userData } = await supabase
            .from("users")
            .select("nickname")
            .eq("id", msg.user_id)
            .single();

          return {
            ...msg,
            usernickname: userData?.nickname ?? "알 수 없음",
          };
        })
      );

      setMessages(messagesWithNicknames);
    };

    fetchMessages();

    // 실시간 구독
    const channel = supabase
      .channel(`chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const msg = payload.new;

          const { data: userData } = await supabase
            .from("users")
            .select("nickname")
            .eq("id", msg.user_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              usernickname: userData?.nickname ?? "알 수 없음",
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 👇 메시지가 바뀔 때마다 스크롤 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !roomId || !user) return;

    const { error } = await supabase.from("chat_messages").insert([
      {
        room_id: roomId,
        user_id: user.id,
        content: input,
      },
    ]);

    if (error) {
      console.error("채팅 전송 실패:", error);
      return;
    }

    setInput("");
  };

  return (
    <>
      <Header />
      <div className={styles.chatRoomContainer}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ←
          </button>
          <h2 className={styles.title}>{roomTitle} 응원 채팅방</h2>
        </div>

        <div className={styles.chatArea}>
          {messages.map((msg) => {
            const isMine = msg.user_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  isMine ? styles.myMessage : styles.otherMessage
                }`}
              >
                <span>
                  <span className={styles.sender}>
                    {isMine ? "나" : msg.usernickname}
                  </span>
                  <span className={styles.favTeam}>
                    {favTeam ? favTeam : "미지정"}
                  </span>
                </span>
                <div className={styles.text}>{msg.content}</div>
                <span className={styles.time}>
                  {formatTime(msg.created_at)}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} /> {/* 👈 스크롤용 빈 div */}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className={styles.input}
          />
          <button onClick={handleSend} className={styles.sendButton}>
            전송
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
