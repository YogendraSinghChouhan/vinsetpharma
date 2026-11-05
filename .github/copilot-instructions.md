# Vinset pharmaceuticals Project Guidelines

- Always read `docs/product.md` and `docs/database-auth.md` before starting any task, and follow them.
- Follow the conventions of the installed Next.js version. Check its local documentation before coding, including `proxy.ts` vs `middleware.ts`, async `params`/`searchParams`, and current caching and revalidation APIs. Do not assume older patterns.
- Use a feature-based structure: `src/features/<feature>/` owns schema, Zod validation, data access, server actions, types, and components. Shared UI belongs in `src/components`, configuration in `src/config`, and database infrastructure in `src/db`.
- Keep TypeScript strict. Do not use `any`, non-null assertions, or `ts-ignore`. Infer types from Zod and Drizzle instead of duplicating them.
- Use Server Components by default. Use `"use client"` only where interaction requires it, keep client components small, and use `server-only` for server modules.
- Every protected data operation and server action must call `requireAdmin()` itself. A page check or redirect is never authorization.
- Validate all external input with Zod on the server, even when the client already validated it.
- Server actions return a typed result (`{ success: true, data } | { success: false, error }`) and never throw for expected failures.
- Prefer small, single-purpose functions and components. Use named exports, except where Next.js requires a default export. Use descriptive names. Do not add dead code, commented-out code, `console.log`, or magic strings/numbers; use constants.
- Comments explain why, never what.
- Use semantic HTML, labelled form controls, visible focus states, alt text, keyboard navigation, and sufficient contrast.
- Use mobile-first responsive styling with Tailwind and shadcn/ui tokens. Do not use inline styles. Use `next/image` and `next/font`.
- Do not add a dependency without stating why and getting approval.
- Build only what the current phase asks for. Do not add extra features or speculative abstractions. This is not a store: no cart, checkout, pricing, or public accounts. Dynamic features are products, categories, blogs, quote requests, media, and hero banner.
- Before finishing any phase, run typecheck, lint, and format, and fix all issues.
- Follow [docs/content-guidelines.md](../docs/content-guidelines.md) for all public copy.
