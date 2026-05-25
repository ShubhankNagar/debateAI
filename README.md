# Agora Debate — AI-Powered Debate Synthesizer

Agora is a full-stack web application that uses Google's Gemini API and Google Search Grounding to synthesize objective, balanced, and evidence-based debates on any public controversy.

## Features

- **Google Search Grounding**: Uses live web search to pull actual empirical evidence, not just LLM training data.
- **3-Tier Fallback System**: Automatically gracefully downgrades if the API is rate-limited or unavailable.
- **Shareable URLs**: Debates are cached and can be shared with a unique URL.
- **Debate History**: Automatically saves your recent debates locally.
- **Production Ready**: Rate limiting, helmet security headers, and compression built-in.
- **Print Optimization**: Clean PDF exports via native browser printing.

## Prerequisites

- Node.js 18+ 
- A Gemini API Key from Google AI Studio

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` and add your `GEMINI_API_KEY`.*

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

This app is designed to be deployed as a monolithic Node.js application (serving both the React frontend and the Express API).

### Using Docker

A production-ready Dockerfile is included:

```bash
docker build -t agora-debate .
docker run -p 3000:3000 -e GEMINI_API_KEY="your_key" agora-debate
```

### Manual Build

```bash
npm run build
npm start
```

## Architecture

- **Frontend**: React 19, TailwindCSS v4, Lucide Icons. Pure CSS animations.
- **Backend**: Express.js, TypeScript, ESBuild.
- **AI**: `@google/genai` SDK using `gemini-2.5-flash` with `googleSearch` tool.
- **Storage**: In-memory LRU cache for backend, `localStorage` for frontend history.
