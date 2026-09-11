---
title: VelociForge
order: 6
date: 2026-08-12
cover: /covers/velociforge.svg
image: /covers/velociforge.svg
excerpt: Virtualized package engine with 0.70ms startup, SBOM generation, and OSV/CVE security auditing for Node.js.
tags:
  - JavaScript
  - Tooling
  - Security
  - Performance
demo: https://moaaz-i.github.io/velociforge/
repo: https://github.com/Moaaz-i/velociforge
---

## What VelociForge Is

**VelociForge** (`vforge`) replaces slow `node_modules` disk I/O bottlenecks and multi-minute `npm ci` network installations by bundling dependency trees into a single compressed cryptographic manifest (`.vforge`).

## Core Capabilities

### Sub-Millisecond Startup

0.70ms ephemeral startup. 1.45ms zero-copy virtual symlink mounting. 0.00ms warm lockfile verification. This is not benchmark theater — it is how fast package restore should be.

### SBOM Generation

CycloneDX 1.4 and SPDX 2.3 SBOM (Software Bill of Materials) generation built in. Know exactly what ships in your dependency tree.

### Security Auditing

OSV/CVE vulnerability scanning integrated into the package manifest. Audit your dependencies without a separate tool or external API.

### Embedded Documentation

A built-in VitePress documentation portal (`vforge docs`) ships with every project — no external hosting required.

## Tech Stack

- **Core:** Node.js with compressed cryptographic manifests
- **Manifest:** `.vforge` format — single file, zero-fetch dependency resolution
- **Audit:** OSV/CVE vulnerability database integration
- **SBOM:** CycloneDX 1.4 + SPDX 2.3 native generation
- **Docs:** Embedded VitePress server
- **Published:** npm package `velociforge`
