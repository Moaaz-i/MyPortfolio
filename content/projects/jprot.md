---
title: JPROT
order: 2
date: 2026-09-11
cover: /covers/jprot.svg
image: /covers/jprot.svg
excerpt: Zero-build portfolio site generator with SSR, SPA navigation, dark mode, 4 themes, and instant search — all in ~30KB.
tags:
  - JavaScript
  - CLI
  - Portfolio
  - Open-Source
demo: https://moaaz-i.github.io/JPROT/
repo: https://github.com/Moaaz-i/JPROT
---

## What JPROT Is

**JPROT** is a portfolio site generator that serves Markdown directly — zero build step, zero npm install required. SSR, SPA navigation, dark mode, 4 built-in themes, instant search, PWA support, SEO/JSON-LD, and a theme cycle button, all in ~30KB.

The project repository is also a live documentation site — start the dev server and the docs are right there.

## Core Features

### Zero Build Step

Write Markdown, start the server, get a site. No Webpack, no Vite, no PostCSS pipeline. The entire generator is a single `npx jprot` command.

### Theme System

4 built-in themes with a cycle button in the header. Every color, font, and spacing token is a CSS variable. Create a custom theme by dropping CSS variables into `theme/custom.css` — no component code required.

### Portfolio Sections

Reusable section components — Stats, Skills, Experience, Services, Testimonials, Gallery, Contact — composable from a config object or inline as `:::Shortcodes` inside Markdown.

### Instant Search

`Cmd/Ctrl + K` opens a search modal that indexes every page body, code block, frontmatter field, and config value. Matches highlight with contextual snippets.

### Resume Builder

Set `layout: resume` in frontmatter, fill in experience/education/skills, and JPROT renders a printable CV with a Download/Print button.

### SEO & Feeds

Sitemap, RSS feed, robots.txt, llms.txt, Open Graph tags, Twitter cards, JSON-LD — all generated automatically from a single `url` config value.

## Tech Stack

- **Core:** Pure Node.js HTTP server (zero dependencies)
- **Rendering:** SSR with SPA client-side navigation
- **Themes:** CSS custom properties, 4 built-in palettes
- **Search:** Full-text client-side index, keyboard-first
- **Export:** `jprot export --out dist` produces static HTML
