+++
title = "Project AGN"
date = 2026-05-01
description = "An agentic framework for academic research — paper-writing pipelines, GPU-shader R&D, and an AI conference reviewer (coming soon)."
+++

**Project AGN** *(Agent)* is an agentic framework for academic research.

Rather than build yet another agent runtime, AGN orchestrates **role-
specialized Claude Code agents** as persistent actors — literature
reviewer, experimenter, paper writer, reviewer — wired together with
SQLite state and JSONL event logs.

## Repositories

### [agn-paper-machine](https://github.com/grand-omega/agn-paper-machine)

An autonomous research-paper generation pipeline. A Python orchestration
layer drives a team of role-specialized agents through literature review,
experiment design, drafting, and self-review, with persistent memory and
explicit message budgeting.

**Stack:** Python, Claude Code as runtime, SQLite, JSONL events.

### [agn-shader-framework](https://github.com/grand-omega/agn-shader-framework)

A multi-agent framework for GPU and shader R&D — planner, coder, analyst,
git-ops, LaTeX reporter, dashboard. Currently early-stage scaffolding for
agent-team experimentation.

**Stack:** Python, `uv`, pytest, ruff, vectorbt.

## Roadmap

- **AI conference reviewer** — coming soon. An automated reviewer agent
  for academic submissions, sharing the same role/state primitives as
  the paper machine.

## Status

**Mature prototype** for the paper machine; **early scaffolding** for the
shader framework. Active development across both.
