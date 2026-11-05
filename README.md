# TwentyFirst (20Hours) 🎯

A high-performance cross-platform desktop application built with **Tauri (Rust)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **SQLite**, designed to guide users through Josh Kaufman's 20-hour rapid skill acquisition protocol.

---

## 🚀 Key Features

### 1. Dashboard & Skill Launcher
- **Active Skills Grid:** View all current and completed deliberate practice campaigns.
- **Progress Ring / Dial:** Visual circular dial tracking progress from 0 to 20 hours with remaining time indicators and mastery badges.
- **Quick Practice Action:** Launch the deliberate practice timer with one click.

### 2. The 4 Kaufman Pillars (Per Skill)

#### Pillar 1: Skill Deconstructor (Phân rã kỹ năng)
- Break complex skills down into manageable micro-skills.
- **80/20 Tagging (★):** Highlight and prioritize the 20% of sub-skills that generate 80% of actual performance results.
- Interactive completion toggling and organization.

#### Pillar 2: Resource Curator (Học đủ để tự sửa sai)
- Curate references (links, articles, YouTube tutorials, books, cheat sheets).
- **Anti-Procrastination Rule:** Automatically alerts the user when 5 or more resources are added, preventing research paralysis and urging immediate practice.
- Mark resources as studied.

#### Pillar 3: Barrier Removal Checklist (Loại bỏ rào cản)
- Pre-session environmental checklist to eliminate physical and mental friction before starting (e.g., "Phone on DND", "Instrument tuned & accessible", "Workspace uncluttered").
- Pre-flight readiness banner and single-click reset button for repeated sessions.

#### Pillar 4: Focus Timer & Reflection Log (Đếm giờ & Nhật ký)
- **Deliberate Practice Countdown Timer:** Custom durations (default 45 min, presets for 15, 25, 30, 45, 60 min).
- Visual ambient pulse animation and **Web Audio API sound chime** upon session completion.
- **Emotional Tracker:** Post-session prompt: *"How do you feel? Do you feel less clumsy today?"* with emoji mood selectors.
- **Confidence Rating:** 1–10 slider logging confidence growth after every practice block.
- **Self-Correction & Insights Log:** Input box to record: *"What went wrong today? What to fix next time?"*
- **Milestone Proof of Work:** Milestone verification at Hours 1, 5, 10, 15, and 20 with ability to record notes and links to audio/video evidence.

### 3. Practice History & Analytics
- Comprehensive timeline of all practice sessions with duration, date/time, post-practice confidence score, and self-correction notes.
- Summary metrics: Total hours practiced, completed sessions, and average confidence rating.

---

## 🛠️ Architecture & Tech Stack

- **Desktop Framework:** [Tauri v2](https://tauri.app/) (Rust backend)
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (dark mode default: `slate-950` / `zinc-900`)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Storage:** Local SQLite database (`twentyfirst.db`) via `@tauri-apps/plugin-sql` with automatic schema migrations + graceful browser fallback for development.

---

## 🏃 Running the Application

### Web Development Mode (Fast preview):
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Desktop Development Mode (Tauri):
```bash
npm run tauri dev
```

### Production Build:
```bash
# Build the React frontend
npm run build

# Build the Tauri desktop binary
npm run tauri build
```
