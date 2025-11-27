# Product Overview

## CouchCMS AI Toolkit

Universal AI development toolkit for CouchCMS projects. Provides consistent AI assistance across projects through modular knowledge modules, specialized agents, and automated configuration generation.

## Key Features

- Interactive setup wizard with project validation (compliance scoring 0-100%)
- 15 knowledge modules (CouchCMS, TailwindCSS, Alpine.js, TypeScript, daisyUI, DataBound Forms, etc.)
- 23 specialized AI agents for development tasks
- Auto-generated configs for Cursor, Claude, Copilot
- Context-aware refactoring patterns with auto-loading rules
- Zero-config operation out of the box

## Target Users

Developers building CouchCMS applications who want consistent, intelligent AI assistance with proper context about CouchCMS patterns, frontend frameworks, and project-specific conventions.

## Architecture

Self-contained toolkit designed to be added as a git submodule to any CouchCMS project. Uses YAML frontmatter + Markdown for configuration (`standards.md`), with automated sync to generate IDE-specific config files.
