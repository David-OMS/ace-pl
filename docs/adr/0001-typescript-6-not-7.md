# 0001. Stay on TypeScript 6.0

- Status: accepted
- Date: 2026-11-16

## Context

TypeScript 7 (the native compiler) is the latest release. `typescript-eslint`, which `eslint-config-next`
uses for linting, currently supports TypeScript up to 6.0 only.

## Decision

Pin TypeScript to `~6.0`.

## Consequences

Linting works with full type information. Upgrade to 7 once `typescript-eslint` supports it.
