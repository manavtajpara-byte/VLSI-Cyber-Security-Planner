import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VLSI & Cyber Security — 3-Year Timetable Planner",
  description: "Interactive 3-year roadmap planner for VLSI and Cyber Security careers. Track tasks, take tests, and reach 24 LPA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ffaa" />
      </head>
      <body>
        <div className="bg-circuit" />
        <div className="bg-orb vlsi" />
        <div className="bg-orb cyber" />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
