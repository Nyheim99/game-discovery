# 🎮 Game Discovery

**[🔗 Live demo](https://game-discovery-lime.vercel.app)** &nbsp;·&nbsp; [![CI](https://github.com/Nyheim99/game-discovery/actions/workflows/ci.yml/badge.svg)](https://github.com/Nyheim99/game-discovery/actions/workflows/ci.yml)

A video game discovery app — browse games, filter by genre and platform, search, sort, and build a wishlist. Built with **React 19**, **TypeScript**, and **Vite**, using data from the [RAWG Video Games Database API](https://rawg.io/apidocs).

> **A learning project.** I'm learning to code with **[Claude Code](https://claude.com/claude-code)** (Anthropic's CLI agent) as my pair programmer — building a real, full-featured app feature by feature, and using each step to actually understand modern React and the tooling around it, rather than just copying snippets. The commit history and pull requests are the story of that process.

## ✨ Features

- **Browse & discover** games, led by a featured hero spotlight and a responsive card grid
- **Rich game detail pages** — screenshot gallery, description, ratings breakdown, where to buy, and similar games
- **Filter** by genre and by platform — filters live in the URL, so views are shareable
- **Live search** — debounced as you type, with a clear button
- **Sort** by rating, release date, name, and more
- **Wishlist** — save games, persisted across reloads, with a dedicated wishlist page
- **Infinite scroll** for seamless browsing
- **Dark / light theme** that respects your OS preference
- **Motion & micro-interactions** — page transitions, staggered cards, and tactile feedback (respects reduced-motion)
- **Accessible** — keyboard- and screen-reader-friendly
- Loading skeletons, image fallbacks, and removable filter chips

## 🛠️ Tech stack

| Area          | Choice                                                         |
| ------------- | -------------------------------------------------------------- |
| Framework     | React 19                                                       |
| Language      | TypeScript                                                     |
| Build tool    | Vite                                                           |
| Routing       | React Router                                                   |
| Styling       | Tailwind CSS                                                   |
| Data fetching | TanStack Query (incl. infinite queries)                        |
| Animation     | Framer Motion                                                  |
| Icons         | react-icons                                                    |
| Testing       | Vitest + React Testing Library (~100% coverage)                |
| Quality       | ESLint + Prettier, with pre-commit hooks (Husky + lint-staged) |
| CI            | GitHub Actions (lint, format, test, build on every PR)         |
| Analytics     | Vercel Web Analytics + Speed Insights                          |
| Hosting       | Vercel (auto-deploy from `main`, preview URLs per PR)          |

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Add your RAWG API key (free from https://rawg.io/apidocs)
#    Create a .env.local file in the project root:
echo "VITE_RAWG_API_KEY=your_key_here" > .env.local

# 3. Start the dev server
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

### Useful scripts

| Script                  | What it does                          |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start the dev server                  |
| `npm run build`         | Type-check and build for production   |
| `npm run test`          | Run tests in watch mode               |
| `npm run test:coverage` | Run tests once with a coverage report |
| `npm run lint`          | Lint the codebase                     |
| `npm run format`        | Format the codebase with Prettier     |

## 📚 What I'm learning

This project is how I'm getting hands-on with the current React ecosystem — things like React 19 form Actions, the modern Context API, TanStack Query for data fetching and caching, lifting state, custom hooks, and TypeScript throughout. Alongside the app itself, I'm learning the surrounding craft: a Git + pull-request workflow, branch protection, continuous integration, automated formatting, and testing — the parts that turn "code that runs" into "a project you can maintain."

## 🙏 Acknowledgements

- Game data from the [RAWG API](https://rawg.io/apidocs).
- Built with [Claude Code](https://claude.com/claude-code).
