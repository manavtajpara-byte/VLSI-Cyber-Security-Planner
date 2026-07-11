"use client";

import React, { useEffect, useState } from "react";

interface LeaderboardUser {
  id: string;
  displayName: string;
  xp: number;
  streak: number;
  badges: string[];
}

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];
const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

export function LeaderboardTab({ currentUserId }: { currentUserId: string }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏆</div>
        <p style={{ color: "var(--text-secondary)" }}>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>🌍 Global Leaderboard</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: 2 }}>Top 10 Grinders Racing to 24 LPA</p>
        </div>
        <div className="stat-pill">
          <span>🔴 Live</span>
        </div>
      </div>

      {/* Top 3 podium */}
      {leaderboard.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[1, 0, 2].map(idx => {
            const u = leaderboard[idx];
            const heights = ["90px", "110px", "70px"];
            const isMe = u.id === currentUserId;
            return (
              <div key={u.id} className="card" style={{
                padding: 16, textAlign: "center",
                background: isMe ? "rgba(0,255,170,0.05)" : undefined,
                border: isMe ? "1px solid var(--cyber)" : undefined,
                position: "relative",
                paddingTop: heights[idx === 0 ? 1 : idx === 1 ? 0 : 2]
              }}>
                <div style={{ fontSize: "1.6rem" }}>{RANK_EMOJIS[idx]}</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginTop: 4, color: RANK_COLORS[idx] }}>{u.displayName}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Lv {Math.floor(u.xp / 1000) + 1}</div>
                <div style={{ fontWeight: 800, color: "var(--vlsi)", fontSize: "0.9rem", marginTop: 4 }}>{u.xp.toLocaleString()} XP</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="card" style={{ padding: 4 }}>
        {leaderboard.length === 0 ? (
          <p style={{ padding: 32, textAlign: "center", color: "var(--text-secondary)" }}>
            No players yet — complete a Pomodoro session to appear here!
          </p>
        ) : (
          leaderboard.map((user, index) => {
            const isMe = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className="leaderboard-row"
                style={{
                  display: "flex", alignItems: "center", padding: "14px 16px",
                  background: isMe ? "rgba(0,255,170,0.04)" : "transparent",
                  borderRadius: 12, gap: 14,
                  borderLeft: isMe ? "3px solid var(--cyber)" : "3px solid transparent"
                }}
              >
                {/* Rank */}
                <div style={{ width: 28, textAlign: "center", fontWeight: 800, fontSize: "0.9rem", color: index < 3 ? RANK_COLORS[index] : "var(--text-muted)" }}>
                  {index < 3 ? RANK_EMOJIS[index] : `#${index + 1}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: `hsl(${(index * 60) % 360}, 60%, 40%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.85rem", color: "#fff"
                }}>
                  {user.displayName.slice(-2)}
                </div>

                {/* Name & level */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isMe ? "var(--cyber)" : "var(--text-primary)" }}>
                    {user.displayName} {isMe && <span style={{ fontSize: "0.72rem", color: "var(--cyber)", fontWeight: 600 }}>(You)</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Level {Math.floor(user.xp / 1000) + 1}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>🔥 {user.streak}d streak</span>
                  </div>
                </div>

                {/* XP */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, color: "var(--vlsi)", fontSize: "0.9rem" }}>{user.xp.toLocaleString()}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>XP</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
