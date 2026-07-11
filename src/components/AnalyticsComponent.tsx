"use client";

import React from "react";

interface StudySession {
  subject: string;
  durationMins: number;
  createdAt: string;
}

export function AnalyticsComponent({ sessions }: { sessions: StudySession[] }) {
  // Aggregate data by subject
  const subjectTotals = sessions.reduce((acc, curr) => {
    acc[curr.subject] = (acc[curr.subject] || 0) + curr.durationMins;
    return acc;
  }, {} as Record<string, number>);

  const totalMins = Object.values(subjectTotals).reduce((a, b) => a + b, 0);

  // Aggregate data by day (last 14 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailyActivity = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d,
      dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mins: 0
    };
  });

  sessions.forEach(s => {
    const sessionDate = new Date(s.createdAt);
    sessionDate.setHours(0, 0, 0, 0);
    const day = dailyActivity.find(d => d.date.getTime() === sessionDate.getTime());
    if (day) day.mins += s.durationMins;
  });

  return (
    <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
      {/* 📊 Subject Mastery */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>Subject Mastery</h3>
        {totalMins === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No study data logged yet. Complete a Pomodoro session!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(subjectTotals).map(([subject, mins]) => {
              const pct = Math.round((mins / totalMins) * 100);
              return (
                <div key={subject}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span>{subject}</span>
                    <span style={{ color: "var(--cyber)", fontWeight: 600 }}>{Math.round(mins / 60 * 10) / 10}h</span>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "var(--bg-dark)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "var(--vlsi)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🗺️ Study Heatmap */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>Activity (Last 14 Days)</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
          {dailyActivity.map((day, i) => {
            const maxMins = Math.max(...dailyActivity.map(d => d.mins), 120); // Scale up to 2 hours minimum
            const heightPct = Math.max((day.mins / maxMins) * 100, day.mins > 0 ? 5 : 0);
            
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div 
                  title={`${day.mins} mins on ${day.dateStr}`}
                  style={{ 
                    width: "100%", 
                    height: `${heightPct}%`, 
                    background: day.mins > 0 ? "var(--cyber)" : "var(--bg-dark)",
                    borderRadius: 4,
                    minHeight: day.mins > 0 ? 4 : 0,
                    transition: "height 0.3s ease"
                  }} 
                />
                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", transform: "rotate(-45deg)", marginTop: 8 }}>
                  {day.date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
