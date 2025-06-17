import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [nickName, setNickname] = useState("");
  const [favTeam, setFavTeam] = useState("");
  useEffect(() => {
    // 닉네임 불러오는 함수
    const fetchNickName = async (userId) => {
      const { data, error } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("닉네임 가져오는 중 에러:", error.message);
      } else {
        setNickname(data.nickname);
      }
    };

    const fetchTeam = async (userId) => {
      const { data, error } = await supabase
        .from("users")
        .select("team")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("팀 가져오는 중 에러:", error.message);
      } else {
        setFavTeam(data.team);
      }
    };

    // 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        fetchNickName(currentUser.id);
        fetchTeam(currentUser.id);
      }
    });

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          fetchNickName(currentUser.id);
          fetchTeam(currentUser.id);
        } else {
          setNickname("");
          setFavTeam("");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNickname("");
    // navigate("/") // 여긴 따로 라우팅 처리 필요하면 추가
  };

  return {
    user,
    isLoggedIn: !!user,
    userName: user?.email || "유저",
    nickName,
    favTeam,
    logout,
  };
}
