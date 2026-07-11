"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CURRICULUM, TEST_BANK } from "@/lib/curriculum";
import type { WeekPlan, TestQuestion } from "@/lib/curriculum";
import { AnalyticsComponent } from "@/components/AnalyticsComponent";
import { LeaderboardTab } from "@/components/LeaderboardTab";
import { AIAssistant } from "@/components/AIAssistant";

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */
interface UserData {
  id: string;
  phone: string;
  startDate: string;
  xp?: number;
  streak?: number;
  badges?: string[];
  studySessions?: { subject: string; durationMins: number; createdAt: string }[];
}
interface VacationPeriod { start: string; end: string; }
interface TestResultData { monthIndex: number; score: number; total: number; weakAreas: string[]; }
interface EventItem { name: string; category: string; url: string; description: string; }

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function getWeekCalendarDate(weekIndex: number, startDate: string, vacations: VacationPeriod[]): string {
  const start = new Date(startDate);
  let totalVacDays = 0;
  vacations.forEach((v) => {
    const vs = new Date(v.start);
    const ve = new Date(v.end);
    if (ve > vs) totalVacDays += Math.ceil((ve.getTime() - vs.getTime()) / (1000 * 60 * 60 * 24));
  });
  const dayOffset = weekIndex * 7 + totalVacDays;
  const d = new Date(start);
  d.setDate(d.getDate() + dayOffset);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ═══════════════════════════════════════
   QUIZ COMPONENT
   ═══════════════════════════════════════ */
function QuizScreen({ monthIndex, onFinish }: { monthIndex: number; onFinish: (r: TestResultData) => void }) {
  const questions = TEST_BANK.filter((q) => q.monthIndex === monthIndex);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; topic: string }[]>([]);

  if (questions.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>No test questions available for Month {monthIndex} yet.</p>
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => onFinish({ monthIndex, score: 0, total: 0, weakAreas: [] })}>
          Go Back
        </button>
      </div>
    );
  }

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setResults((prev) => [...prev, { correct: idx === q.correctIndex, topic: q.topic }]);
  };

  const handleNext = () => {
    if (isLast) {
      const score = results.filter((r) => r.correct).length;
      const weakTopics = [...new Set(results.filter((r) => !r.correct).map((r) => r.topic))];
      onFinish({ monthIndex, score, total: questions.length, weakAreas: weakTopics });
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
          <span className="tag tag-test">📝 Month {monthIndex} Test</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {current + 1} / {questions.length}
          </span>
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>{q.question}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, idx) => {
            let cls = "quiz-option";
            if (answered && idx === q.correctIndex) cls += " correct";
            else if (answered && idx === selected && idx !== q.correctIndex) cls += " wrong";
            else if (!answered && idx === selected) cls += " selected";
            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <button className="btn btn-primary" style={{ marginTop: 20, width: "100%" }} onClick={handleNext}>
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════ */
export default function Dashboard() {
  // Hydration safety
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<"study" | "break">("study");
  const [totalStudyHours, setTotalStudyHours] = useState(0);

  // Data state
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [vacations, setVacations] = useState<VacationPeriod[]>([]);
  const [testResults, setTestResults] = useState<TestResultData[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"timetable" | "tests" | "hackathons" | "events" | "analytics" | "leaderboard">("timetable");
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({});
  const [showVacForm, setShowVacForm] = useState(false);
  const [vacStart, setVacStart] = useState("");
  const [vacEnd, setVacEnd] = useState("");
  const [quizMonth, setQuizMonth] = useState<number | null>(null);

  // Init: show roadmap immediately — set start date to today
  useEffect(() => {
    try {
      const startDate = localStorage.getItem("roadmap-start") || new Date().toISOString();
      localStorage.setItem("roadmap-start", startDate);
      setUser({ id: "guest", phone: "guest", startDate, xp: 0, streak: 0, badges: [] });

      // Also try to load saved completions from localStorage (no login needed)
      const savedTasks = localStorage.getItem("roadmap-tasks");
      if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));
      
      const savedVac = localStorage.getItem("roadmap-vacations");
      if (savedVac) setVacations(JSON.parse(savedVac));
      
      const savedTests = localStorage.getItem("roadmap-tests");
      if (savedTests) setTestResults(JSON.parse(savedTests));

      const savedHours = localStorage.getItem("roadmap-study-hours");
      if (savedHours) setTotalStudyHours(parseFloat(savedHours));

      // Local gamification loading
      const localXP = localStorage.getItem("roadmap-xp");
      const localStreak = localStorage.getItem("roadmap-streak");
      const localBadges = localStorage.getItem("roadmap-badges");
      setUser((prev) => prev ? {
        ...prev,
        xp: localXP ? parseInt(localXP) : 0,
        streak: localStreak ? parseInt(localStreak) : 0,
        badges: localBadges ? JSON.parse(localBadges) : []
      } : null);
    } catch (e) {
      console.error("Error parsing local storage", e);
      // Reset corrupted storage
      localStorage.removeItem("roadmap-tasks");
      localStorage.removeItem("roadmap-vacations");
      localStorage.removeItem("roadmap-tests");
    } finally {
      setMounted(true);
    }
  }, []);

  // Fetch events once
  useEffect(() => {
    setEvents([
      { name: "Monthly Hackathon", category: "hackathon", url: "https://devfolio.co", description: "Compete in a monthly hackathon to apply your VLSI/Cyber skills." },
      { name: "Linux Basics Test", category: "test", url: "#", description: "End-of-month test covering Linux CLI fundamentals." }
    ]);
  }, []);

  // Local helper for logging XP
  const addXP = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const newXP = (prev.xp || 0) + amount;
      localStorage.setItem("roadmap-xp", String(newXP));
      return { ...prev, xp: newXP };
    });
  }, []);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      if (timerMode === "study") {
        const newHours = totalStudyHours + 0.5;
        setTotalStudyHours(newHours);
        localStorage.setItem("roadmap-study-hours", String(newHours));
        
        // Log locally
        addXP(50);
        
        alert("📚 Great work! 25-minute Pomodoro study block completed! (+50 XP)");
      } else {
        alert("☕ Break finished! Ready to lock back in?");
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, timerMode, totalStudyHours, addXP]);

  const toggleTask = (taskId: string) => {
    const newVal = !completedTasks[taskId];
    const updated = { ...completedTasks, [taskId]: newVal };
    setCompletedTasks(updated);
    localStorage.setItem("roadmap-tasks", JSON.stringify(updated));
  };

  const addVacation = () => {
    if (!vacStart || !vacEnd) return;
    const updated = [...vacations, { start: vacStart, end: vacEnd }];
    setVacations(updated);
    localStorage.setItem("roadmap-vacations", JSON.stringify(updated));
    setVacStart("");
    setVacEnd("");
    setShowVacForm(false);
  };

  const finishQuiz = (result: TestResultData) => {
    const updated = [...testResults.filter((r) => r.monthIndex !== result.monthIndex), result];
    setTestResults(updated);
    localStorage.setItem("roadmap-tests", JSON.stringify(updated));
    setQuizMonth(null);
  };

  const toggleMonth = (month: number) => {
    setExpandedMonths((p) => ({ ...p, [month]: !p[month] }));
  };

  // Derived data
  const totalTasks = CURRICULUM.reduce((sum, w) => sum + w.tasks.length, 0);
  const doneTasks = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Group weeks by year → month
  const years = [1, 2, 3];
  const getMonthsForYear = (year: number) => {
    const monthSet = new Set<number>();
    CURRICULUM.filter((w) => w.year === year).forEach((w) => monthSet.add(w.month));
    return Array.from(monthSet).sort((a, b) => a - b);
  };
  const getWeeksForMonth = (month: number) => CURRICULUM.filter((w) => w.month === month);

  /* ═══ RENDER ═══ */

  if (quizMonth !== null) return <QuizScreen monthIndex={quizMonth} onFinish={finishQuiz} />;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px" }}>
      {/* ═══ GAMIFICATION HEADER ═══ */}
      {user && (
        <div className="card" style={{ padding: "12px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg, var(--bg-card) 0%, rgba(30,30,40,0.5) 100%)", borderLeft: "4px solid var(--cyber)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "rgba(0, 255, 170, 0.1)", color: "var(--cyber)", padding: "8px 12px", borderRadius: "8px", fontWeight: 700 }}>
              Level {Math.floor((user.xp || 0) / 1000) + 1}
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 4 }}>Total XP</div>
              <div style={{ fontWeight: 800 }}>{user.xp || 0} / {(Math.floor((user.xp || 0) / 1000) + 1) * 1000}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.2rem" }}>🔥</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>{user.streak || 0} Day Streak</div>
            </div>
            {user.badges && user.badges.length > 0 && (
              <div style={{ display: "flex", gap: 4 }}>
                {user.badges.slice(0, 3).map((b, i) => (
                  <span key={i} title={b} style={{ fontSize: "1.2rem" }}>🏆</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            ⚡ 3-Year <span style={{ color: "var(--vlsi)" }}>VLSI</span> + <span style={{ color: "var(--cyber)" }}>Cyber Security</span> Planner
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>🎯 Goal: 24 LPA Placement — Started {user ? new Date(user.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.clear(); window.location.reload(); }}>Reset</button>
      </header>

      {/* ═══ PROGRESS ═══ */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 700 }}>Overall Progress</span>
          <span style={{ color: "var(--vlsi)", fontWeight: 800, fontSize: "1.1rem" }}>{progressPct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 8 }}>
          {doneTasks} / {totalTasks} tasks completed
        </p>
      </div>

      <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }}>
        {/* LEFT COLUMN: Timetable & Quizzes & Hackathons */}
        <div>
          {/* ═══ TABS ═══ */}
          <div className="tabs" style={{ marginBottom: 20, display: "inline-flex", flexWrap: "wrap", gap: 8 }}>
            {(["timetable", "tests", "hackathons", "analytics", "leaderboard"] as const).map((t) => (
              <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                {t === "timetable" ? "📅 Timetable" : t === "tests" ? "📝 Tests" : t === "analytics" ? "📊 Analytics" : t === "leaderboard" ? "🌍 Leaderboard" : "🏆 Hackathons"}
              </button>
            ))}
          </div>

          {/* ═══ LEADERBOARD TAB ═══ */}
          {activeTab === "leaderboard" && (
            <LeaderboardTab currentUserId={user?.id || ""} />
          )}

          {/* ═══ ANALYTICS TAB ═══ */}
          {activeTab === "analytics" && (
            <AnalyticsComponent sessions={(user as any)?.studySessions || []} />
          )}

          {/* ═══ TIMETABLE TAB ═══ */}
          {activeTab === "timetable" && (
            <div>
              {years.map((year) => (
                <div key={year} style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>
                    {year === 1 ? "📅 Year 1: Rock-Solid Foundations" : year === 2 ? "📅 Year 2: SystemVerilog & Architecture" : "📅 Year 3: UVM & Job Hunting"}
                  </h2>
                  {getMonthsForYear(year).map((month) => {
                    const weeks = getWeeksForMonth(month);
                    const monthTasks = weeks.flatMap((w) => w.tasks);
                    const monthDone = monthTasks.filter((t) => completedTasks[t.id]).length;
                    const isExpanded = expandedMonths[month] ?? false;
                    return (
                      <div key={month} className="card" style={{ marginBottom: 8, overflow: "hidden" }}>
                        <div className="month-header" onClick={() => toggleMonth(month)}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "1.2rem" }}>{isExpanded ? "▼" : "▶"}</span>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Month {month}</span>
                              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 8 }}>
                                {weeks[0]?.theme}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ color: monthDone === monthTasks.length && monthTasks.length > 0 ? "var(--cyber)" : "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600 }}>
                              {monthDone}/{monthTasks.length}
                            </span>
                            {user && (
                              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                {getWeekCalendarDate(weeks[0]?.weekIndex || 0, user.startDate, vacations)}
                              </span>
                            )}
                          </div>
                        </div>
                        {isExpanded && (
                          <div style={{ padding: "8px 16px 16px" }}>
                            {weeks.map((week) => (
                              <div key={week.weekIndex} style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <h4 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{week.title}</h4>
                                  {user && (
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                      {getWeekCalendarDate(week.weekIndex, user.startDate, vacations)}
                                    </span>
                                  )}
                                </div>
                                {week.hackathonAlert && (
                                  <div style={{ marginBottom: 10, padding: "10px 14px", background: "var(--pink-glow)", borderRadius: 10, border: "1px solid rgba(255,60,120,0.3)" }}>
                                    <span className="tag tag-hack" style={{ marginBottom: 6 }}>🏆 {week.hackathonAlert.name}</span>
                                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: 4 }}>{week.hackathonAlert.description}</p>
                                    <a href={week.hackathonAlert.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--pink)", fontSize: "0.8rem", fontWeight: 600 }}>
                                      Register →
                                    </a>
                                  </div>
                                )}
                                {week.tasks.map((task) => (
                                  <label key={task.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", cursor: "pointer", borderBottom: "1px solid var(--border)" }}>
                                    <input
                                      type="checkbox"
                                      className="task-check"
                                      checked={!!completedTasks[task.id]}
                                      onChange={() => toggleTask(task.id)}
                                      style={{ marginTop: 3 }}
                                    />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{
                                          fontWeight: 600, fontSize: "0.9rem",
                                          textDecoration: completedTasks[task.id] ? "line-through" : "none",
                                          color: completedTasks[task.id] ? "var(--text-muted)" : "var(--text-primary)",
                                        }}>
                                          {task.title}
                                        </span>
                                        <span className={`tag ${task.track === "vlsi" ? "tag-vlsi" : task.track === "cyber" ? "tag-cyber" : "tag-general"}`}>
                                          {task.track}
                                        </span>
                                        {task.type === "test" && <span className="tag tag-test">TEST</span>}
                                        {task.type === "hackathon" && <span className="tag tag-hack">HACKATHON</span>}
                                      </div>
                                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 3 }}>{task.description}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ═══ TESTS TAB ═══ */}
          {activeTab === "tests" && (
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 16 }}>📝 Monthly Assessment Tests</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
                Take these tests to find your weak areas. Results sync across all your devices.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {[3, 5, 6, 7, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((m) => {
                  const result = testResults.find((r) => r.monthIndex === m);
                  const qCount = TEST_BANK.filter((q) => q.monthIndex === m).length;
                  return (
                    <div key={m} className="card" style={{ padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontWeight: 700 }}>Month {m}</span>
                        {result ? (
                          <span style={{ color: result.score / result.total >= 0.6 ? "var(--cyber)" : "var(--danger)", fontWeight: 800 }}>
                            {result.score}/{result.total}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{qCount} questions</span>
                        )}
                      </div>
                      {result && result.weakAreas.length > 0 && (
                        <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginBottom: 8 }}>
                          Weak: {result.weakAreas.join(", ")}
                        </p>
                      )}
                      <button
                        className={`btn btn-sm ${result ? "btn-ghost" : "btn-primary"}`}
                        style={{ width: "100%" }}
                        onClick={() => setQuizMonth(m)}
                      >
                        {result ? "Retake Test" : "Start Test"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ HACKATHONS TAB ═══ */}
          {activeTab === "hackathons" && (
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 16 }}>🏆 Competitions & Hackathons</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
                Participate in these to build your portfolio and test your real-world skills.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {events.map((ev, i) => (
                  <div key={i} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span className={`tag ${ev.category === "VLSI" || ev.category === "Circuit Design" ? "tag-vlsi" : ev.category === "CTF" || ev.category === "Bug Bounty" ? "tag-cyber" : "tag-hack"}`}>
                        {ev.category}
                      </span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 8 }}>{ev.name}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 12, lineHeight: 1.5 }}>{ev.description}</p>
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-cyber btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      Visit Website →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar (Pomodoro & Vacation) */}
        <div className="sidebar" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* ⏱️ POMODORO TIMER */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              ⏱️ Study Focus Timer
            </h3>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <div style={{ fontSize: "3rem", fontWeight: 800, fontFamily: "monospace", letterSpacing: "1px", color: timerMode === "study" ? "var(--vlsi)" : "var(--cyber)" }}>
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <span className={`tag ${timerMode === "study" ? "tag-vlsi" : "tag-cyber"}`} style={{ marginTop: 8 }}>
                {timerMode === "study" ? "Focus Session" : "Break Mode"}
              </span>
            </div>
            
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button 
                className={`btn btn-sm ${timerActive ? "btn-danger" : "btn-primary"}`} 
                style={{ flex: 1 }}
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? "Pause" : "Start"}
              </button>
              <button 
                className="btn btn-sm btn-ghost" 
                onClick={() => {
                  setTimerActive(false);
                  setTimeLeft(timerMode === "study" ? 1500 : 300);
                }}
              >
                Reset
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <button 
                className="btn btn-ghost btn-sm" 
                style={{ flex: 1, fontSize: "0.75rem" }}
                onClick={() => {
                  setTimerActive(false);
                  setTimerMode("study");
                  setTimeLeft(1500);
                }}
              >
                Study (25m)
              </button>
              <button 
                className="btn btn-ghost btn-sm" 
                style={{ flex: 1, fontSize: "0.75rem" }}
                onClick={() => {
                  setTimerActive(false);
                  setTimerMode("break");
                  setTimeLeft(300);
                }}
              >
                Break (5m)
              </button>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Study Logged:</span>
              <strong style={{ fontSize: "0.9rem", color: "var(--cyber)" }}>{totalStudyHours} hrs</strong>
            </div>
          </div>

          {/* 🏖️ VACATION MODE */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>🏖️ Vacation Mode</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowVacForm((p) => !p)}>
                {showVacForm ? "Cancel" : "+ Add Vacation"}
              </button>
            </div>
            {showVacForm && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                <input className="input" type="date" value={vacStart} onChange={(e) => setVacStart(e.target.value)} />
                <input className="input" type="date" value={vacEnd} onChange={(e) => setVacEnd(e.target.value)} />
                <button className="btn btn-primary btn-sm" style={{ width: "100%" }} onClick={addVacation}>Save</button>
              </div>
            )}
            {vacations.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {vacations.map((v, i) => (
                  <span key={i} className="tag tag-general" style={{ justifyContent: "center" }}>{v.start} → {v.end}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ UPCOMING EVENTS TAB (Full Width) ═══ */}
      {activeTab === "events" && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>Upcoming Events</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {events.map((ev, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span className={`tag ${ev.category === "VLSI" || ev.category === "Circuit Design" ? "tag-vlsi" : ev.category === "CTF" || ev.category === "Bug Bounty" ? "tag-cyber" : "tag-hack"}`}>
                    {ev.category}
                  </span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 8 }}>{ev.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 12, lineHeight: 1.5 }}>{ev.description}</p>
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-cyber btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Visit Website →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer style={{ textAlign: "center", padding: "40px 0 20px", color: "var(--text-muted)", fontSize: "0.8rem" }}>
        Built for the 24 LPA goal. Keep grinding. 🚀
      </footer>
      
      {/* ═══ AI ASSISTANT ═══ */}
      <AIAssistant />
    </div>
  );
}
