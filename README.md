# RukaTV+

RukaTV+ is a high-performance, pixel-precise streaming web application inspired by the minimalist Apple TV aesthetic, built with React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, and Hls.js.

Designed for seamless deployment on **Vercel** with full client-side routing, SEO metadata, and dynamic Xtream Codes API integration.

---

## Features

- **Cinematic Hero Billboard (`FlowcaseHero`)**: Smooth crossfade transitions, auto-rotation with hover pause, Ruka Original branding, and quick-action buttons.
- **Dynamic Content Shelves (`ShelfRail`)**:
  - Up Next (synced with browser `localStorage`)
  - Top 10 on RukaTV with custom typographic ranking counters
  - Blockbuster Movies
  - Top Series & Dramas
  - Live TV Channels
- **Dedicated Full-Screen Routing (No Floating Modals for SEO)**:
  - `/`: Main showcase and curated rails
  - `/tv-season`: 24/7 Live Television Channels and categories
  - `/up-next`: Personal queue and watchlist
  - `/search`: Dedicated search page with real-time query sync (`/search?q=...`)
  - `/title/:id`: Full-bleed title page with Schema.org JSON-LD structured data, metadata, cast, director, and season/episode selector
  - `/legal/:tab`: Comprehensive legal documentation (`privacy`, `terms`, `sales`, `legal`, `support`)
- **Embedded HLS Video Player**: Custom HUD media player with keyboard shortcuts, volume curve, seek bar, and live stream recovery.
- **Clean Aesthetic**: Zero emojis anywhere in the user interface, utilizing clean SVG typography and icons.

---

## Environment Variables

To connect RukaTV+ to an Xtream Codes server, configure the following environment variables (locally in `.env` or in the Vercel Dashboard):

| Variable | Description |
|---|---|
| `VITE_XTREAM_SERVER` | Base URL of your Xtream Codes server (e.g. `https://your-server.com`) |
| `VITE_XTREAM_USER` | Server username |
| `VITE_XTREAM_PASS` | Server password |

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and import the repository.
3. Under **Environment Variables**, add:
   - `VITE_XTREAM_SERVER`
   - `VITE_XTREAM_USER`
   - `VITE_XTREAM_PASS`
4. Click **Deploy**. Vercel will build and host the application with custom domain and edge caching support.
