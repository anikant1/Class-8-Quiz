# Class 8 Science Quiz - Solids, Liquids, and Gases

An interactive, responsive Multiple Choice Quiz (MCQ) web application built for Class 8 students covering the states of matter: **Solids, Liquids, and Gases**.

## Features

- **100 Curated MCQs:** Complete set of questions sourced from [Footprints-Science](https://www.footprints-science.co.uk/index.php?quiz=Solids_liquids_and_gases), ICSE Chemistry (Selina / Concise), CBSE NCERT Science, and BBC Bitesize KS3.
- **Modern UI & UX:** Built with React 19, TypeScript, and Tailwind CSS.
- **Interactive Option Selection:** Clickable options with tick confirmation and answer badges.
- **Instant Explanations & Feedback:** Immediate color-coded feedback highlighting correct and incorrect answers upon checking.
- **Category & Topic Filters:** Filter questions across topics like:
  - Particle arrangement, proximity, and movement
  - Kinetic theory of matter and forces (cohesion, adhesion)
  - Changes of state, latent heat, and sublimation
  - Thermal expansion, pressure, and evaporation
  - Advanced states (Plasma, BEC)
- **Live Stopwatch & Score Tracker:** Real-time stats on completed, correct, and incorrect questions.
- **Celebration Confetti:** Interactive celebratory animations powered by `canvas-confetti`.
- **Vercel Ready:** Pre-configured for immediate one-click deployment on [Vercel](https://vercel.com).

## Tech Stack

- **Framework:** [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete 100 questions quiz web app"
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com/new).
3. Import your GitHub repository (`anikant1/Class-8-Quiz`).
4. Select `Vite` as the framework preset (it auto-detects).
5. Click **Deploy**.
