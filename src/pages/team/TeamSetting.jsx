import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import styles from "./TeamSetting.module.css";
import Header from "../../components/header/header";
import * as constants from "../../constants/constants";

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
        console.log("현재 유저 id:", user.id);
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
    if (!userId) {
      alert("유저 정보를 불러오지 못했어요.");
      return;
    }

    setLoading(true);

    const { error, data } = await supabase
      .from("users")
      .update({ team: selectedTeam })
      .eq("id", userId)
      .select();

    setLoading(false);

    console.log("update 결과:", { error, data });

    if (error) {
      console.error("팀 설정 실패:", error);
      alert("팀 설정에 실패했어요.");
    } else if (!data || data.length === 0) {
      // 성공했는데 데이터 없으면 대부분 RLS, where 조건 문제
      alert("팀이 저장되지 않았어요. 권한/조건 문제일 수 있습니다.");
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
            {constants.teams.map((team) => (
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
