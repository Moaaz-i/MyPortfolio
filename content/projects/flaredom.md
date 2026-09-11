---
title: FlareDom
order: 7
date: 2026-07-02
cover: /covers/flaredom.svg
image: /covers/flaredom.svg
excerpt: C++ UI framework for ESP8266/ESP32 — build responsive web dashboards entirely from C++, no HTML files or SPIFFS.
tags:
  - C++
  - Embedded
  - ESP32
  - IoT
repo: https://github.com/Moaaz-i/FlareDom
---

## What FlareDom Is

**FlareDom** is a lightweight C++ UI framework that lets you build dynamic, responsive web dashboards and interfaces directly on ESP8266/ESP32 — **no HTML files, no SPIFFS, no frontend toolchain.** Just pure C++ components that render beautiful HTML.

13+ built-in components. Zero external dependencies. Everything is generated at compile time from C++ code.

## Core Features

### Pure C++ Component Model

Define your interface entirely in C++. FlareDom compiles component trees into optimized HTML strings that stream directly to the browser — no template engine, no file I/O.

### 13+ Built-in Components

Buttons, cards, grids, inputs, sliders, toggles, charts, navigation bars — a complete UI toolkit for embedded dashboards without writing a single line of HTML.

### No Filesystem Required

Everything runs from RAM. No SPIFFS, no LittleFS, no filesystem uploads. The interface is generated at compile time from C++ source code.

### Responsive Design

Built-in responsive grid system. Your ESP32 dashboard looks good on phones, tablets, and desktop browsers without media queries or CSS frameworks.

## Tech Stack

- **Language:** C++17 for ESP8266/ESP32
- **Rendering:** Compile-time HTML generation from C++ component trees
- **Transport:** Direct HTTP streaming from microcontroller RAM
- **Components:** 13+ built-in UI primitives
- **Size:** Minimal flash footprint, no filesystem dependency
