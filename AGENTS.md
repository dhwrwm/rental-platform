# AGENTS.md

## Purpose

This repository is a `pnpm` monorepo for a rental platform. It currently contains:

- `apps/api`: NestJS API with Prisma and Better Auth
- `apps/web`: Next.js frontend
- `packages/ui`: shared UI package
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TypeScript config

Use this file as the default contributor/agent guide for making changes safely and consistently.

## Stack

- Package manager: `pnpm`
- Monorepo task runner: `turbo`
- API: NestJS 11
- Web: Next.js 16 / React 19
- Database: PostgreSQL via Prisma 7
- Auth: `better-auth` integrated into Nest via `@thallesp/nestjs-better-auth`

## Repo Map

- `apps/api/src/main.ts`: Nest bootstrap and CORS setup
- `apps/api/src/app.module.ts`: Nest module wiring, including auth module setup
- `apps/api/src/auth.ts`: Better Auth instance configuration
- `apps/api/src/lib/prisma.ts`: Prisma client singleton using `@prisma/adapter-pg`
- `apps/api/prisma/schema.prisma`: Prisma schema
- `apps/web/app`: Next.js app router code
- `apps/web/lib`: frontend helpers and shared web-side utilities

## Common Commands

From the repo root:

- Install deps: `pnpm install`
- Run all apps: `pnpm dev`
- Build all apps/packages: `pnpm build`
- Run type checks: `pnpm check-types`
- Run lint: `pnpm lint`

Scoped commands:

- API dev: `pnpm --filter api dev`
- API build: `pnpm --filter api build`
- API tests: `pnpm --filter api test`
- Web dev: `pnpm --filter web dev`
- Web build: `pnpm --filter web build`
- Web type checks: `pnpm --filter web check-types`

## Auth Notes

- The API uses `@thallesp/nestjs-better-auth` through `AuthModule.forRoot(...)`.
- Better Auth is configured in `apps/api/src/auth.ts`.
- The auth guard is global by default.
- Add `@AllowAnonymous()` to Nest routes that should be public.
- Use `@OptionalAuth()` for routes that can work with or without a session.

## Prisma Notes

- Prisma client is generated into `apps/api/src/generated/prisma`.
- The runtime client uses `@prisma/adapter-pg` in `apps/api/src/lib/prisma.ts`.
- Do not hand-edit generated Prisma client files.
- Keep schema changes in `apps/api/prisma/schema.prisma` and generate/migrate from the API workspace.

Useful Prisma commands:

- `pnpm --filter api exec prisma validate --schema prisma/schema.prisma`
- `pnpm --filter api exec prisma generate --schema prisma/schema.prisma`
- `pnpm --filter api exec prisma migrate dev`

## Environment

- API and web each have their own `.env` expectations.
- Check the existing `.env.example` files before adding new variables.
- Keep `API_URL`, `WEB_URL`, and `DATABASE_URL` aligned when working on auth flows.

## Working Rules

- Prefer small, targeted changes over broad refactors.
- Preserve existing patterns unless there is a clear reason to improve them.
- Avoid editing lockfiles manually.
- Avoid editing generated output unless regeneration is impossible.
- If you change API contracts, verify whether the web app also needs an update.
- If you touch auth or Prisma setup, verify both startup and build paths when possible.

## Validation Expectations

- For API-only changes, prefer `pnpm --filter api build` and any relevant tests.
- For web-only changes, prefer `pnpm --filter web build` or `pnpm --filter web check-types`.
- For cross-cutting changes, run the smallest meaningful validation for each touched app.

## Notes For Future Agents

- This repo has active auth work in progress, so read current files before refactoring.
- Better Auth and Prisma wiring are already partially customized; do not assume default scaffolding.
- When in doubt, inspect the local package versions in `package.json` before applying cookbook examples.
