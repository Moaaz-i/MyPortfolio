---
title: MicroTaskX
order: 8
date: 2026-07-07
cover: /covers/microtaskx.svg
image: /covers/microtaskx.svg
excerpt: High-performance micro-RTOS for Arduino with CPU profiling, power management, and compile-time task configuration.
tags:
  - C++
  - Arduino
  - RTOS
  - Embedded
repo: https://github.com/Moaaz-i/MicroTaskX
---

## What MicroTaskX Is

**MicroTaskX** is an ultra-lightweight, high-performance micro-RTOS and multitasking framework designed for Arduino (AVR & ESP32). It maximizes CPU efficiency by eliminating blocking delays, introducing independent macro-based timers, background task scheduling with dynamic controls, and real-time CPU load profiling.

## Core Features

### Zero-Overlap Modular Architecture

Separates the core scheduling kernel (`MTXKernel`) from hardware utilities (`MTXUtils`) to minimize memory consumption. Each module compiles only what it needs.

### Dynamic Compile-Time Configuration

C++ templates let you customize maximum task bounds (`MicroTaskXKernel<MAX_TASKS>`) at compile time — zero runtime overhead for task allocation.

### Runtime Task Management

Built-in APIs to pause, resume, and modify task intervals dynamically during execution. One-shot tasks execute exactly once before auto-deactivating.

### Independent Macro Timers

`MTX_EVERY` token-pasting macros create non-blocking intervals on any line of code — no callback registration, no object allocation.

### Real-Time CPU Profiling

Monitor actual CPU load percentage dynamically via free idle-loop calculation. Know exactly how much headroom your firmware has.

### Smart Sleep Integration

Automatic power management mapped to the next scheduled task. Idle Sleep on AVR, precise Light Sleep on ESP32 — power savings without timing drift.

### Direct Port Manipulation

`toggleFast<PIN>()` template routine executes in a single clock cycle on AVR microcontrollers — no `digitalWrite` overhead.

## Tech Stack

- **Language:** C++11/C++17
- **Platforms:** Arduino AVR (ATmega328P+), ESP32
- **Scheduling:** Compile-time configured kernel with runtime control
- **Power:** Automatic idle/light sleep mapped to task timing
- **Profiling:** Real-time CPU load via idle-loop measurement
- **License:** MIT
