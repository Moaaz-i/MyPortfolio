---
title: AeroCI
order: 5
date: 2026-08-12
cover: /covers/aeroci.svg
image: /covers/aeroci.svg
excerpt: Local digital twin and pipeline simulator for GitHub Actions — debug CI in milliseconds without wasting remote quota.
tags:
  - JavaScript
  - CI/CD
  - DevOps
  - CLI
demo: https://github.com/Moaaz-i/AeroCI
repo: https://github.com/Moaaz-i/AeroCI
---

## What AeroCI Is

**AeroCI** is a local digital twin and pipeline simulator for GitHub Actions. It eliminates blind commits and lets you debug CI pipelines locally in milliseconds — without burning remote CI minutes.

Simulate the entire pipeline execution locally in an isolated ephemeral environment, or enter an interactive debug sandbox with simulated CI context variables.

## Core Features

### Pre-Flight Checks

Detect YAML syntax errors, missing local `.env` secrets, and workflow configuration problems before pushing.

### Local Simulation

Run the full pipeline locally in an isolated ephemeral environment. Every step, every action, every output — previewed in real time on your machine.

### Interactive Debug Sandbox

Enter a debug shell with simulated CI context variables (`GITHUB_SHA`, `GITHUB_REF`, `GITHUB_WORKSPACE`, etc.) to step through pipeline logic interactively.

### Live Analytics Dashboard

A web UI (powered by the Velociradix HTTP engine) showing pipeline execution metrics, timing, and failure points in real time.

## Tech Stack

- **Core:** Node.js CLI with local simulation engine
- **Engine:** Velociradix HTTP for the analytics dashboard
- **Actions:** Local GitHub Actions runtime simulation
- **Interface:** CLI commands + live web UI
- **Published:** npm package `aeroci`
