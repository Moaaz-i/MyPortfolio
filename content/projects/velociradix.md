---
title: Velociradix
order: 3
date: 2026-08-27
cover: /shots/velociradix.png
image: /covers/velociradix.svg
excerpt: Node.js HTTP framework with a C++17 native engine — kqueue/epoll workers, radix-trie router, custom HTTP parser.
tags:
  - JavaScript
  - C++
  - HTTP
  - Performance
demo: https://moaaz-i.github.io/Velociradix/
repo: https://github.com/Moaaz-i/Velociradix
---

## What Velociradix Is

**Velociradix** is a Node.js HTTP framework with a **C++17 native engine** — kqueue/epoll workers, `SO_REUSEPORT`, and a radix-trie router. The JavaScript API looks like a small Express app. For static routes, the bytes on the wire are parsed and answered entirely in C++.

The HTTP parser is **custom C++** — not llhttp. That is a deliberate trust decision, not a footnote.

## Key Design Decisions

### C++ Native Engine

The core routing and static response path runs in a compiled `.node` addon. Install uses a prebuild when one exists; otherwise it compiles from source. No npm runtime dependencies.

### Dual Response Paths

`fastGet` / `fastPost` handle static routes by writing bytes in C++ — V8 is never involved. Dynamic routes use the standard JS handler path (`app.get`, middleware, `ctx.json`) for real application code.

### Express Compatibility

`velociradix/express` provides a compatibility shim — not full Express, but enough to migrate existing middleware without rewriting everything.

### Custom HTTP Parser

A bespoke C++ HTTP/1.1 parser replaces llhttp. Every request is validated and routed before JavaScript sees it. This is a security and performance decision.

## Tech Stack

- **Server:** Node.js 20+ with native `.node` addon
- **Engine:** C++17 (kqueue on macOS, epoll on Linux, SO_REUSEPORT workers)
- **Router:** Radix-trie with compile-time path optimization
- **Parser:** Custom C++ HTTP/1.1 implementation
- **API:** Express-like JS surface (`app.get`, `ctx.json`, middleware)
- **Published:** npm package `velociradix`
