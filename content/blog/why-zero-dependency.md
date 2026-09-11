---
title: Why I Build Software That Stands Alone
date: 2026-09-02
tags:
  - philosophy
  - zero-dependency
  - nodejs
excerpt: Zero dependencies is not an aesthetic choice — it is an engineering contract with every developer who installs your package.
---

Every time I publish a package, I run `npm ls` and feel a quiet sense of achievement when the tree is empty.

Zero dependencies is not an aesthetic choice. It is an engineering contract with every developer who installs your software:

## Trust, by Default

When your library pulls in `left-pad`-style transitive chains, you are asking every downstream user to audit code they never chose to read. A zero-dependency package has exactly one surface: **the code you actually wrote**. Every maintainer you add to your tree is a supply-chain risk you introduced on someone else's behalf.

## Reproducibility

`node_modules` can be corrupted, deleted, or subtly patched. A package with zero dependencies is reproducible from a single source file — clone it, run it, done. No lockfile archaeology, no resolution heuristics, no "works on my machine" because it works everywhere by construction.

## Speed

This is obvious but worth stating: an empty dependency graph loads instantly and boots in microseconds. Velociforge's `.vforge` format exists precisely because `node_modules` disk I/O dominated every CI startup. When the requirement is 0.70ms startup, the fastest dependency is the one you don't have.

## What You Give Up

Honestly, a lot — and that is the discipline. You give up convenient abstractions, feature depth, and "everyone already uses it" momentum. You end up reimplementing simple things (a tiny router, a scheduler) that libraries solve better.

But I have found that reimplementing the simple thing teaches you the hard thing. My custom HTTP parser in Velociradix exists because I refused to accept llhttp as a black box. That refusal is where the real education lives.

**Zero dependencies means that when your software fails, the only person you can blame is yourself. That is exactly why it makes you a better engineer.**