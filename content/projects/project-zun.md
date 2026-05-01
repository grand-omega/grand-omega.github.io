+++
title = "Project ZUN"
date = 2026-04-24
description = "Local, self-hosted AI image editor built on FLUX.1 Fill and FLUX 2 klein. Runs on a single 16 GB consumer GPU."
aliases = ["/projects/zun-flux-pipeline/"]
+++

**Project ZUN** is a complete, self-hosted stack for instruction-driven and
mask-based image editing. Everything runs on a single consumer GPU
(**RTX 4070 Ti Super, 16 GB VRAM**), from a photo to a finished edit in
roughly **7 seconds** per job.

Designed for one user, one workstation, one phone — no cloud, no
multi-tenant complexity, no subscriptions.

## Two inference tracks

| Track | What it's for | Speed |
|---|---|---|
| **FLUX.1 Fill** | Mask-based inpainting with auto-masking (GroundingDINO + SAM). Strongest identity preservation; supports FLUX.1 LoRAs. | Standard |
| **FLUX 2 klein** | Maskless, instruction-driven editing with a 4B-parameter model. Primary track. | 5–6× faster |

Both tracks are driven through the same HTTP workflow runner, so switching
between them is a single flag.

## What's in the box

- **Custom-outfit editing** with trained subject LoRAs
- **Full LoRA training pipelines** for both FLUX.1 (ai-toolkit) and FLUX 2
  klein (musubi-tuner) — on the same 16 GB GPU used for inference
- **Dataset prep tooling** with JoyCaption for automatic captioning and
  structural validation
- **Clean HTTP API** and a native mobile client — drive the system from
  your couch

## Repositories

### [zun-flux-pipeline](https://github.com/grand-omega/zun-flux-pipeline)

The ML core. ComfyUI workflows (10 of them), training configs, dataset
prep, and inference recipes. The shipped project is ~100 KB of config and
source; the reconstructed working system is ~90 GB after model downloads.

**Stack:** Python, ComfyUI, FLUX.1 Fill, FLUX 2 klein, SAM1/SAM2,
GroundingDINO, ai-toolkit, musubi-tuner.

### [zun-rust-server](https://github.com/grand-omega/zun-rust-server)

The API layer. A single-user Rust server wrapping ComfyUI with:

- Job orchestration with a SQLite (WAL) queue
- Crash recovery on restart
- A background health monitor probing ComfyUI every 30 s
- Bearer-token auth over LAN or Tailscale — no public exposure required

**Stack:** Rust, axum 0.8, sqlx, tokio, reqwest (pure-Rust TLS).

### [zun-android-app](https://github.com/grand-omega/zun-android-app)

The client. A high-performance Android app optimized for the
**Samsung Galaxy Z Fold 7**:

- Dynamic two-pane layouts and adaptive List-Detail scaffolds
- Biometric lockout with customizable timer
- Immersive photo viewer with pinch-zoom and swipe-between-generations
- 2048px automatic downscaling and real-time upload progress
- Encrypted credential storage, `Authorization: Bearer` contract

**Stack:** Kotlin, Jetpack Compose.

### [zun-zola-site](https://github.com/grand-omega/zun-zola-site)

The product-launch site for ZUN — branded phone-frame mockups, before/after
galleries, and the marketing entry point.

**Stack:** Zola, SCSS.

## Design philosophy

- **Local-first.** Your photos never leave your network.
- **Single-user, self-hosted.** No multi-tenant complexity, no cloud bills.
- **Consumer hardware.** One GPU. One phone. One workstation.
- **Shippable is small.** The entire orchestrated system reconstructs from
  ~100 KB of source plus model downloads.

## Status

**v2.0.0** — FLUX.1 Fill and FLUX 2 klein inference, klein LoRA training,
multi-reference edits, face restore. End-to-end verified against real
FLUX 2 klein at ~7 s per job.
