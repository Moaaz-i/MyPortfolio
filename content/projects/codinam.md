---
title: Codinam
order: 9
date: 2026-07-23
cover: /covers/codinam.svg
image: /covers/codinam.svg
excerpt: A custom programming language with a C++ compiler, standard library, JavaScript FFI bridge, and VS Code extension.
tags:
  - C++
  - Language-Design
  - Compiler
  - VS-Code
demo: https://github.com/Moaaz-i/Codinam
repo: https://github.com/Moaaz-i/Codinam
---

## What Codinam Is

**Codinam** is a custom programming language with a modern C++ compiler, standard libraries, JavaScript FFI bridge configurations, and an official VS Code extension with syntax highlighting and inline diagnostics.

## Core Components

### The Compiler (`codinamc`)

Written in C++17 with a modular architecture: separate modules for lexical analysis, parsing, type checking, and intermediate representation (IR) generation. Cross-platform builds for Linux, macOS (Intel & ARM), and Windows.

### Standard Libraries

Bundled with the compiler: standard data structure and utility libraries that ship as part of the Codinam ecosystem.

### JavaScript FFI Bridge

Interoperability with JavaScript through configured FFI bindings. Call JavaScript functions from Codinam and vice versa — bridging systems-level and web-level code.

### VS Code Extension

Full syntax highlighting for `.cd` files, a custom **Codinam Dark** color theme, and automatic integration with the `codinamc` compiler for inline diagnostics and error reporting.

## Tech Stack

- **Compiler:** C++17 with Makefile cross-compilation
- **Lexer/Parser:** Custom hand-written implementation
- **Type Checker:** Static typing with IR generation
- **IDE:** VS Code extension with diagnostic integration
- **Platforms:** Linux, macOS, Windows
- **FFI:** JavaScript bridge configuration
