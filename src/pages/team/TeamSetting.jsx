import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./TeamSetting.module.css";
import Header from "../../components/header/Header";

const teams = [
  "기아 타이거즈",
  "LG 트윈스",
  "두산 베어스",
  "한화 이글스",
  "삼성 라이온즈",
  "롯데 자이언츠",
  "SSG 랜더스",
  "KT 위즈",
  "NC 다이노스",
  "키움 히어로즈",
];

function TeamSetting() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        setUserId(user.id);
      }
    };

    getUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeam) {
      alert("응원팀을 선택해 주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({ team: selectedTeam })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      console.error("팀 설정 실패:", error);
      alert("팀 설정에 실패했어요.");
    } else {
      alert("팀이 성공적으로 저장됐어요!");
      navigate("/");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>응원팀 설정</h2>
        <form onSubmit={handleSubmit}>
          <select
            className={styles.select}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            disabled={loading}
          >
            <option value="">-- 팀을 선택하세요 --</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </form>
      </div>
    </>
  );
}
export default TeamSetting;
