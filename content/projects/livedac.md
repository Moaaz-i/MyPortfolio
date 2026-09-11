---
title: LiveDAC
order: 11
date: 2026-07-05
cover: /covers/livedac.svg
image: /covers/livedac.svg
excerpt: High-performance software DAC engine for ESP8266 — waveform synthesis, PCM playback, LFO, ADSR, and dual-pin output.
tags:
  - C++
  - Arduino
  - Audio
  - ESP8266
repo: https://github.com/Moaaz-i/LiveDAC
---

## What LiveDAC Is

**LiveDAC** is a high-performance software DAC engine for ESP8266. It provides advanced waveform synthesis, PCM audio playback, LFO modulation, ADSR envelopes, wavetables, soft clipping, filtering, and dual-pin output — all running in software on an ESP8266 without external DAC hardware.

## Core Features

### Waveform Synthesis

Sine, Triangle, Sawtooth, Square, and Noise waveforms generated in real time using high-speed PWM — no external DAC chip required.

### FM and AM Synthesis

Frequency modulation and amplitude modulation synthesis. Combine carriers and modulators to create complex, evolving tones from pure computation.

### WaveTable Support

Load and play custom wavetables for sampled audio or complex waveform shapes beyond the built-in generators.

### ADSR Envelope Generator

Attack, Decay, Sustain, Release envelope shaping for musical note dynamics. Map to any waveform or wavetable.

### LFO Modulation

Low-frequency oscillators for vibrato, tremolo, filter sweeps, and other cyclic modulation effects.

### PCM Audio Streaming

Stream PCM audio data through the software DAC — play pre-recorded samples, sound effects, or generated audio in real time.

### Dual-Pin Output

Drive two independent PWM output pins simultaneously for stereo or multi-channel audio output.

## Tech Stack

- **Platform:** ESP8266
- **Language:** C++ (Arduino framework)
- **DAC:** High-speed PWM software synthesis
- **Audio:** Waveform generation, FM/AM, wavetables, PCM streaming
- **Envelope:** ADSR with LFO modulation
- **Output:** Dual-pin stereo-capable PWM
