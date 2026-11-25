# AI Code Reviewer v2.0 Pro

An AI-powered static analysis, security auditing, and automated refactoring platform built with **React**, **Tailwind CSS**, **Node.js/Express**, and **Google Gemini 2.5 Flash**.

---

## Key Features

- **Hybrid Static + AI Review Pipeline:** Pairs an instant client-side AST/Regex pre-checker (`<5ms` latency) with structured JSON schema analysis from `gemini-2.5-flash`.
- **4 Specialized AI Reviewer Personas:**
  - **Senior Full-Stack Engineer:** Balanced review of bugs, architecture, edge cases, and maintainability.
  - **Beginner Mentor:** Warm, educational explanations and clean naming guidance.
  - **OWASP Security Auditor:** Strict inspection for SQL injection, XSS sinks, hardcoded secrets, and unsafe buffers.
  - **Performance Optimizer:** Big-O complexity reduction, memory leak detection, and bottleneck elimination.
- **True Line-by-Line LCS Diff Viewer:** Compare original and refactored code across **Unified Diff**, **Split Diff**, and **Clean Improved** views with `+` / `-` line highlights.
- **GitHub File URL Importer:** Paste any public `github.com/.../blob/...` URL to automatically fetch raw source code and detect its programming language.
- **Interactive Line-Scoped AI Mentor:** Click **Ask Follow-Up** on any flagged issue to open a contextual chat drawer pinned to that specific line of code.
- **Engineering Telemetry Dashboard & PDF Reports:** Track quality score trajectories, severity distributions, language stats, and export printable audit reports.

---

## System Architecture

```text
┌─────────────────────────┐      ┌──────────────────────────┐
│   React + Tailwind UI   │─────▶│ Static AST/Regex Engine  │
│  (Editor & LCS Diff)    │      │  (<5ms Pre-Check Hints)  │
└───────────┬─────────────┘      └──────────────────────────┘
            │
            ▼
┌─────────────────────────┐      ┌──────────────────────────┐
│  Node.js / Express API  │─────▶│  Google Gemini 2.5 Flash │
│   (Secure .env Proxy)   │      │ (Strict JSON Schema Out) │
└─────────────────────────┘      └──────────────────────────┘
