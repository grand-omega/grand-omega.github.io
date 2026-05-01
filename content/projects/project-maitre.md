+++
title = "Project Maître"
date = 2026-04-24
description = "AI bout analysis for competitive fencers and their coaches. Server foundations shipped; analysis pipeline in development."
aliases = ["/projects/project-matrie/"]
+++

**Project Maître** is an AI analysis tool purpose-built for competitive
fencers and their coaches.

Maître ingests bout footage and extracts the things that actually matter on
the strip — tempo, distance, action sequences, decision patterns — so
athletes can review competitions with clarity instead of hours of manual
tagging.

## Repositories

### [maitre-rust-server](https://github.com/grand-omega/maitre-rust-server)

The service backbone. A Rust API server with manually provisioned private
user groups and session-based authentication — the foundation the bout
analyzer will sit on.

- Argon2 password hashing
- `tower-sessions` session management
- Bearer-token API surface
- Provisioning workflow documented in-repo

**Stack:** Rust, Axum, Tokio, `tower-sessions`, Argon2.

## Status

**Server foundations shipped.** The bout-analysis pipeline (footage
ingestion, action segmentation, tempo/distance extraction) is in active
development and will land as a separate repo.

If you are a fencer, coach, or club interested in early access, watch this
organization.
