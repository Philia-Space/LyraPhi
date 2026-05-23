# LyraPhi

**JLPT Practice Exam Application — Next.js 14 Frontend**

LyraPhi is the frontend application for the Philia-Space JLPT exam ecosystem. It provides a modern, responsive interface for taking JLPT practice exams, viewing results, checking leaderboards, and managing user profiles.

## Overview

| Attribute | Value |
|-----------|-------|
| **Name** | LyraPhi (リラ — Lyra, the constellation) |
| **Port** | 3000 |
| **Stack** | Next.js 14 + TypeScript + Tailwind CSS |
| **BFF Pattern** | Proxies to AuthPhi, MondaiPhi, ShikenPhi |

## Features

- **Exam Interface**: Take JLPT N1–N5 practice exams with question navigation
- **Audio Player**: Inline audio playback for listening sections
- **Furigana Support**: Hover to reveal readings for kanji
- **Real-Time Answers**: Save answers as you go
- **Results & Review**: View score, section breakdowns, and time spent
- **Leaderboard**: Weekly/monthly/all-time rankings per level
- **User Profile**: Stats, streaks, exam history
- **Admin Dashboard**: Question CRUD and asset management (admin only)
- **Responsive Design**: Works on desktop, tablet, and mobile

## Architecture

```
LyraPhi/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── page.tsx                 # Home / landing
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── exam/                    # Exam session page
│   │   ├── results/                 # Results page
│   │   ├── leaderboard/             # Rankings page
│   │   └── profile/                 # User stats page
│   ├── components/                  # Shared components
│   │   ├── Navbar.tsx               # Top navigation
│   │   ├── LevelBadge.tsx           # N1–N5 badge
│   │   ├── QuestionCard.tsx         # Exam question card
│   │   ├── AudioPlayer.tsx          # Listening audio player
│   │   ├── FuriganaText.tsx         # Hover-to-reveal furigana
│   │   └── QuestionNavigator.tsx    # Question sidebar
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # API clients for microservices
│   │   └── auth.ts                  # Auth utilities
│   └── types/                       # TypeScript types
├── public/                          # Static assets
├── next.config.js                   # Next.js config with rewrites
├── tailwind.config.js               # Tailwind theme
└── package.json
```

## BFF Proxy Configuration

LyraPhi acts as a Backend-for-Frontend, proxying API calls to microservices:

| Route | Destination | Service |
|-------|-------------|---------|
| `/api/auth/*` | `http://authphi:8080/api/auth/*` | AuthPhi |
| `/api/mondai/*` | `http://mondaiphi:8087/*` | MondaiPhi |
| `/api/shiken/*` | `http://shikenphi:8088/*` | ShikenPhi |

## Configuration

```env
AUTH_SERVICE_URL=http://localhost:8080
MONDAI_SERVICE_URL=http://localhost:8087
SHIKEN_SERVICE_URL=http://localhost:8088
```

## Getting Started

```bash
cd apps/lyraphi
npm install
npm run dev
```

## Authentication

LyraPhi uses AuthPhi for Discord OAuth:
1. User logs in via AuthPhi
2. JWT token stored in `phi_token` cookie
3. All API calls include the token via proxy
4. Admin routes check for `admin` role

## Related Services

- **MondaiPhi** (問題) — Question bank
- **ShikenPhi** (試験) — Exam session engine
- **AuthPhi** — Authentication & JWT

## License

ISC
