---
title: From Arduino Sketches to a Micro-RTOS
date: 2026-07-30
tags:
  - cpp
  - embedded
  - rtos
  - microtaskx
excerpt: What I learned building a real-time operating system that fits on an ATmega328P — and why every Arduino developer should understand scheduling.
---

The `delay()` function is a lie. It blocks the CPU, burns power, and destroys responsiveness. Moving beyond it — into an actual scheduler — is one of the most clarifying journeys an embedded developer can take.

## The Limits of Super-Loops

A typical Arduino sketch is a `super-loop`: poll every sensor, update every display, repeat. It works until three tasks want the CPU at the same time. Then you get flickering displays, missed button presses, and a hum of wasted cycles.

MicroTaskX started as an attempt to answer one question: *what is the smallest codebase that can honestly call itself a real-time scheduler?*

## Scheduling Without the Scheduler

The kernel is deliberately tiny:

- **Compile-time task bounds** via `MicroTaskXKernel<MAX_TASKS>` — C++ templates, so the memory allocation cost is zero at runtime.
- **Macro timers** (`MTX_EVERY`) that token-paste into non-blocking intervals — no callback registration, no heap objects.
- **Runtime controls** — pause, resume, and reschedule tasks while they run.

## The Two Hardest Parts

**Power management.** The kernel sleeps toward the *next* scheduled task instead of sleeping on a fixed interval. On ESP32, that means Light Sleep aligned to the exact timing need; on AVR, Idle Sleep. Power draws get measured, not guessed.

**CPU profiling.** You cannot know how much headroom you have unless you measure free idle-loop cycles. The profiler runs on the samples that nobody else would bother counting — and it changes how you tune your firmware.

## What I'd Tell a Beginner

Scheduling is not an exotic topic. It is the difference between firmware that frustrates you and firmware that feels *alive*. Build a small scheduler, run three tasks, watch them interleave. You will never write a blocking `delay()` the same way again.

MicroTaskX is open source — the whole kernel fits in one header file, which is the best documentation a library can have.