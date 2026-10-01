# 💝 Happy Birthday — A Digital Love Letter

A magical, scroll-driven birthday website built as a personal love gift. Every scroll, every tap, every moment is designed to feel intimate, romantic, and unforgettable.

## ✨ Features

- **Dreamy Loading Screen** — Pulsing heart with letter-by-letter name reveal
- **Scroll Storytelling** — GSAP ScrollTrigger + Framer Motion powered journey
- **Floating Hearts** — Canvas-based particle system with soft physics
- **Interactive Gift Box** — Tap to open with spring animation + confetti burst
- **Photo Memories Gallery** — Horizontal carousel on mobile, grid on desktop
- **Animated Love Reasons** — 20 reasons revealed one by one as you scroll
- **Future Dreams** — Parallax cards with warm sunset gradients
- **Birthday Message** — Line-by-line emotional reveal with bokeh effects
- **Love Notes Form** — Optional MongoDB-backed wish submission
- **Micro-interactions** — Heart bursts, glow effects, and hover animations everywhere

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion + GSAP ScrollTrigger |
| Backend | Node.js + Express |
| Database | MongoDB (optional, for love notes) |

## 🚀 Quick Start

### Frontend (required)

```bash
cd client
npm install
npm run dev
```

The site will open at **http://localhost:5173**

### Backend (optional — only needed for love notes feature)

```bash
cd server
npm install
npm run dev
```

The API will run at **http://localhost:5000**

> **Note:** The frontend works perfectly without the backend. The backend is only needed if you want the love notes form to save to a database.

### MongoDB (optional)

If you want to use the love notes feature:

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community) locally, or create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
2. Update the `MONGODB_URI` in `server/.env`

## 📸 How to Add Her Photos

This is the most important part! Here's how to add her real photos:

### Step 1: Add photos to the project

Drop her photos into:
```
client/public/photos/
```

### Step 2: Update the config

Open `client/src/config/content.ts` and update the image paths:

```typescript
// How We Met timeline
timeline: [
  {
    date: "January 2024",
    title: "The Day We Met",
    description: "Your story here...",
    image: "/photos/how-we-met.jpg",  // ← Update this path
  },
  // ...
],

// Photo memories
memories: [
  {
    image: "/photos/memory-1.jpg",  // ← Update this path
    caption: "Our first adventure",
    date: "April 2024",
  },
  // ...
],
```

### Step 3: Personalize the text

In the same `content.ts` file, customize:
- `herName` — Her name (displayed in hero and loading screen)
- `timeline` — Your milestone moments
- `memories` — Photo captions and dates
- `reasons` — Your personal reasons for loving her
- `dreams` — Your future dreams together
- `giftMessage` — The message inside the gift box
- `birthdayMessage` — The final emotional message (shown line by line)

### Recommended photo sizes

| Section | Recommended Size | Aspect Ratio |
|---------|-----------------|--------------|
| Timeline | 800×500px | 16:10 |
| Memories | 600×750px | 4:5 |

Photos will be automatically cropped to fit, so any size works — these are just optimal dimensions for best quality.

## 📁 Project Structure

```
bday/
├── client/                    # React frontend
│   ├── public/photos/         # ← Her photos go here
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── sections/      # Page sections (in scroll order)
│   │   │   └── layout/        # Layout components
│   │   ├── config/
│   │   │   └── content.ts     # ← All personalizable content
│   │   ├── lib/
│   │   │   └── api.ts         # API client
│   │   ├── App.tsx            # Main app shell
│   │   └── index.css          # Design system + global styles
│   └── index.html
│
├── server/                    # Express backend (optional)
│   ├── src/
│   │   ├── index.ts           # Server entry
│   │   ├── routes/notes.ts    # Love notes API
│   │   └── models/Note.ts     # MongoDB schema
│   └── .env                   # MongoDB connection config
│
└── README.md                  # You are here 💝
```

## 💕 Made with Love

This website is a labor of love. Every animation, every color, every word is chosen to make her smile. Happy Birthday! 🎂
