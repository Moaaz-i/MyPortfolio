---
title: FLASH
order: 1
date: 2026-08-28
cover: /covers/flash.svg
image: /covers/flash.svg
excerpt: Zero-knowledge encrypted document database engine with HNSW vector search, AI-native RAG, and server-blind architecture.
tags:
  - JavaScript
  - TypeScript
  - Database
  - Security
demo: https://moaaz-i.github.io/FLASH/
repo: https://github.com/Moaaz-i/FLASH
---

## What FLASH Is

**FLASH** is a zero-knowledge encrypted document database engine — a standalone storage engine, not a plugin on top of another database. The server never holds your keys or plaintext. Built so creating AI does not require surrendering the documents, memory, and prompts that feed it.

It is the first line of privacy protection while AI is being built — private RAG, agent memory, sealed documents, not a plugin added after the model ships.

## Core Capabilities

### Server-Blind by Design

AES-256-GCM encryption, blind indexes, and ORE range tokens form the foundation — not optional plugins. Every query against encrypted data executes without the server ever seeing plaintext.

### AI-Native Storage

HNSW vector search, semantic cache, RAG context optimizer, and LLM tool-calling built directly into the engine. Store, search, and retrieve embeddings without leaving the encrypted layer.

### Purpose-Built Formats

`FlashBinary`, `.farc` WAL, `.flog` oplog — zero-copy, LSM-backed storage formats designed for encrypted workloads. No legacy JSON overhead. No unnecessary serialization.

### Local-First Architecture

Embedded in-process or served over the FLASH wire protocol. Your data stays under your key, always. No cloud dependency required.

## Tech Stack

- **Engine:** JavaScript/TypeScript core with custom binary formats
- **Cryptography:** AES-256-GCM, blind indexes, ORE range tokens
- **Search:** HNSW vector index, semantic caching
- **Storage:** LSM-tree backed WAL and oplog formats
- **Publishing:** npm package `flash-zk` with 198 passing tests
