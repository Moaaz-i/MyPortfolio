---
title: A C++ Engine Hidden Inside Node.js
date: 2026-08-20
tags:
  - cpp
  - nodejs
  - performance
  - velociradix
excerpt: Velociradix embeds a C++17 HTTP server inside Node.js to serve static routes without ever touching the V8 engine.
---

A Node.js HTTP framework that answers requests in **C++** sounds contradictory. Velociradix does exactly that — and the design decisions behind it are the interesting part.

## The Problem With Express

JavaScript frameworks are elegant but slow. Every request in Express flows through JavaScript: object allocation, callback dispatch, property lookups. For a JSON API with a database behind it, nobody notices. For a static asset server or a health-check endpoint, you are spending microseconds on JSON dispatch you never asked for.

## The Hybrid Architecture

Velociradix splits its response path in two:

1. **`fastGet` / `fastPost`** — static routes answered entirely in C++. The bytes are written by the native addon; V8 never runs.
2. **`app.get` / middleware / `ctx.json`** — dynamic routes with JavaScript business logic.

The native core uses **kqueue** (macOS) or **epoll** (Linux), spawns workers with **SO_REUSEPORT**, and routes requests through a **radix-trie** router compiled into the addon.

## The Custom HTTP Parser

The most controversial decision: a hand-written HTTP/1.1 parser in C++ instead of llhttp.

This is not performance theater. Writing your own parser is a **trust decision**. llhttp is a C library that has to translate into V8's world anyway. By keeping parsing in the C++ layer, Velociradix validates and routes everything before a single object enters JavaScript — and you can read the entire parsing logic instead of trusting black-box bindings.

## What Fast Actually Means

On static routes, the C++ engine writes the response envelope — status line, headers, body — in one pass. The JavaScript runtime is bypassed for the hot path, which is where "fast" stops being a benchmark and starts being infrastructure: an uptime probe that responds in microseconds instead of milliseconds.

## The Lesson

The biggest win was architectural: **you do not have to choose between ergonomics and speed**. A thin JavaScript API over a compiled core gives you the best of both. JPROT, AeroCI, and Velociforge all follow this same pattern — the JS side is the ergonomics, the C++ or compact format side is the performance.

It proves that the most interesting engineering lives at the boundaries between layers.