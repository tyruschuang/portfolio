# Portfolio

Personal portfolio site for Tyrus Chuang — AI-forward engineer.

Built with React, TypeScript, Tailwind CSS v4, and Framer Motion. Styled with Playfair Display + Outfit on a warm off-white palette with terracotta accents.

## Features

- **Generative flow field** — canvas-based particle animation on the hero, driven by Perlin noise
- **Magnetic cursor** — custom cursor that snaps toward interactive elements
- **Scroll progress bar** — thin progress indicator across the top of the viewport
- **Text scramble effect** — headline characters randomize then resolve on load
- **Animated stat counters** — numbers count up into view on the hero section
- **Tilt cards** — perspective transforms on project cards that follow the pointer
- **Reduced motion support** — all animation respects `prefers-reduced-motion`

## Stack

| Layer       | Tech                              |
| ----------- | --------------------------------- |
| Framework   | React 19 + TypeScript             |
| Build       | Vite 7                            |
| Styling     | Tailwind CSS 4                    |
| Animation   | Framer Motion 12                  |
| Canvas      | Vanilla 2D context (Perlin noise) |

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command        | Description                  |
| -------------- | ---------------------------- |
| `yarn dev`     | Start dev server             |
| `yarn build`   | Type-check & production build|
| `yarn preview` | Preview production build     |
| `yarn lint`    | Run ESLint                   |

## Project Structure

```
src/
├── components/    # Reusable UI (cursor, navbar, cards, animations)
├── sections/      # Page sections (Hero, About, Work, Projects, Contact)
├── data/          # Content & copy
├── lib/           # Utilities (easing, Perlin noise)
├── App.tsx
└── main.tsx
```
