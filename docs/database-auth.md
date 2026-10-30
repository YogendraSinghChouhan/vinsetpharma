# Database and authentication

## Versions and references

- Drizzle ORM and Kit: pinned to `1.0.0-rc.5`, the `rc` tag recommended by the [Neon guide](https://orm.drizzle.team/docs/get-started/neon-new) when configured.
- Better Auth and its Drizzle adapter: pinned to stable `1.7.14`, which supports Drizzle RC.
- [Better Auth Drizzle Relations v2 adapter](https://better-auth.com/docs/adapters/drizzle#drizzle-relations-v2).
- [T3 Env Next.js configuration](https://env.t3.gg/docs/nextjs).

## Architecture

Following the Hemraj Sharma reference project's separation of configuration, database infrastructure and features:

- `src/config/env.ts`: single source of truth for validated application environment variables.
- `src/db/client.ts`: shared Neon HTTP Drizzle connection and relations.
- `src/db/schema/index.ts`: schema aggregation only; re-exports feature-owned schemas.
- `src/features/auth/schema.ts`: Better Auth CLI-generated tables and Relations v2 definitions. Do not duplicate these elsewhere.
- `src/features/auth/auth.ts`: canonical Better Auth configuration, importable by the CLI.
- `src/features/auth/server.ts`: server-only entry point for application code.
- `src/features/auth/client.ts`: React auth client, using same-origin requests.
- `src/features/auth/data.ts`: session lookup and `requireAdmin()` guard.
- `src/app/api/auth/[...all]/route.ts`: thin framework adapter.
- `drizzle/`: generated SQL migrations and snapshots; commit these.

Future products, blogs and quotes features should own their schemas, validation, data access, actions and components. Re-export their schemas through the database schema entry point. Merge full application relations before partial auth relations in the database client.

Call `requireAdmin()` inside every protected data operation or server action. A page/layout check or proxy redirect alone is not authorization. Every seeded user is an admin; there are no public accounts or role plugins.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to your Neon PostgreSQL connection string, including TLS options.
3. Generate a secret: `bun -e 'console.log(require("node:crypto").randomBytes(32).toString("base64"))'`.
4. Set `BETTER_AUTH_SECRET` and `APP_URL` (locally `http://localhost:3000`; HTTPS in production).
5. Run `bun run db:migrate` to apply the committed migration.
6. Temporarily add `ADMIN_EMAIL`, `ADMIN_NAME` and `ADMIN_PASSWORD` (at least 12 characters) to `.env.local`, then run `bun run auth:seed-admin`. This uses Better Auth's password hashing and an atomic Neon batch. It refuses to run when a user already exists.
7. Remove the temporary seeding credentials, especially the password.
8. Run `bun run dev` and request `GET /api/auth/ok` to check the handler.

T3 Env validates required settings at application startup/build and in database tooling. Empty values are treated as missing. No validation bypass or fallback credentials are provided. Drizzle tooling and the seeding script use Next.js environment loading, including `.env.local`.

## Schema workflow

- After auth config/plugin changes: `bun run auth:generate`, then `bun run format`.
- Generate a migration: `bun run db:generate`.
- Review SQL and commit both SQL and snapshots.
- Apply migrations: `bun run db:migrate`.
- Inspect development data: `bun run db:studio`.
- `bun run db:push` is available for disposable development databases only; use migrations for deployed databases.
- Verify TypeScript: `bun run typecheck`.

Schema generation does not apply database changes. Generation still requires valid environment configuration, but does not need a live database connection.

## Security and scope

Email/password authentication is enabled, public signup is disabled, and the password minimum is 12 characters. Sessions last one day with hourly refresh; no cookie session cache is enabled. Better Auth's default origin, CSRF and production secure-cookie protections remain enabled. Rate limits are database-backed for serverless deployments, with five email sign-in attempts per minute. The initial admin's email is trusted as verified by the operator running seeding.

This setup does not include sign-in UI, email verification delivery, password reset delivery, OAuth, or dashboard pages. Configure a real email provider before adding reset or verification flows. Do not enable public registration to seed an admin.
