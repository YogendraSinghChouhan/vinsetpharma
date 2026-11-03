# Vinset Pharma

A modern marketing, product showcase, and enquiry platform for Vinset Pharma. Visitors can explore company information, browse pharmaceutical products, read scientific articles and news, and submit requests for quotes. A protected administration dashboard allows authorized personnel to manage products, categories, blog posts, quote enquiries, and media (photos and videos).

> **Scope Note**: This application is not an e-commerce store. It contains no shopping cart, no checkout, no payment gateways, and no public user accounts. Authentication is strictly reserved for administrators.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Cache Components)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Language**: TypeScript (Strict mode)
- **Database & ORM**: PostgreSQL ([Neon Serverless](https://neon.tech/)) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (admin credential authentication with secure session cookies)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) and Tabler Icons
- **Forms & Validation**: [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev/)
- **Rich Text & Sanitization**: [Tiptap](https://tiptap.dev/) + [sanitize-html](https://www.npmjs.com/package/sanitize-html) (server-enforced allowlist)
- **Storage**: AWS S3 or S3-compatible object storage (presigned upload URLs)
- **Bot Protection**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- **Email Delivery**: [Resend](https://resend.com/) with [@react-email/components](https://react.email/)
- **Code Standards**: [Biome](https://biomejs.dev/) for formatting and linting

---

## Local Setup

### Prerequisites
- [Bun](https://bun.sh/) (v1.2+)
- A PostgreSQL database instance (local or Neon serverless)
- An S3-compatible bucket (AWS, Cloudflare R2, MinIO)
- Cloudflare Turnstile keys (site key and secret key)
- A Resend API key for email delivery

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd vinset-pharma
bun install
```

### 2. Environment Configuration
Copy the template and configure your local environment:
```bash
cp .env.example .env.local
```
Fill in the credentials according to the [Environment Variables](#environment-variables) section below. Detailed instructions for Neon and Better Auth setup are documented in [docs/database-auth.md](docs/database-auth.md).

### 3. Database Initialization & Admin Seeding
Generate database schema, apply migrations, and create your initial admin user:
```bash
# Apply migrations to database
bun run db:migrate

# Seed the initial admin account
bun run auth:seed-admin
```

### 4. Running the Development Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Access the admin portal at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Environment Variables

All environment variables are validated at runtime via `@t3-oss/env-nextjs`. Ensure all required variables are set:

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Server | PostgreSQL connection string (`postgresql://...`) with SSL enabled. |
| `APP_URL` | Server | Canonical base URL of the application (`http://localhost:3000` locally, `https://...` in production). |
| `BETTER_AUTH_SECRET` | Server | High-entropy base64 string (min 32 characters) used to sign auth cookies and tokens. |
| `S3_ENDPOINT` | Server | *(Optional)* Custom S3 endpoint URL (e.g., for Cloudflare R2 or MinIO; omit for standard AWS). |
| `S3_REGION` | Server | S3 region where the media bucket is provisioned (e.g., `us-east-1`). |
| `S3_BUCKET` | Server | Name of the S3 bucket storing product, category, and blog images. |
| `S3_ACCESS_KEY_ID` | Server | IAM user access key with read, write, and delete permissions for the S3 bucket. |
| `S3_SECRET_ACCESS_KEY` | Server | IAM user secret access key. |
| `S3_PUBLIC_URL` | Server | Public base URL serving S3 images (CDN domain or public bucket URL). |
| `NEXT_PUBLIC_S3_PUBLIC_URL` | Client | *(Optional)* Client-exposed public base URL matching `S3_PUBLIC_URL`. |
| `RESEND_API_KEY` | Server | API key from Resend for sending quote notification emails. |
| `QUOTE_NOTIFICATION_EMAIL`| Server | Recipient email address where incoming quote requests are forwarded. |
| `QUOTE_FROM_EMAIL` | Server | Verified sender email address configured in Resend (e.g., `quotes@vinsetpharma.com`). |
| `TURNSTILE_SECRET_KEY` | Server | Cloudflare Turnstile secret key for server-side verification. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client | Cloudflare Turnstile public site key rendered in client forms. |

---

## External Service Configurations

### 1. S3 Bucket Requirements
1. **Credentials & Permissions**: Storage credentials configured via `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` require `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, and `s3:HeadObject` permissions (read, write, and delete on the bucket).
2. **Public Read**: Ensure objects in the bucket have public read access (or serve them via a CloudFront CDN distribution) so images can be displayed publicly.
3. **CORS Configuration**: The browser uploads directly to S3 via presigned PUT URLs. Configure CORS on the bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["PUT", "GET", "HEAD"],
       "AllowedOrigins": ["https://vinsetpharma.com", "http://localhost:3000"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```
3. **Security Headers**: Enable `X-Content-Type-Options: nosniff` on your CDN distribution if using CloudFront.

### 2. Resend Sender Domain Verification
1. Add your sending domain in the [Resend Domains Dashboard](https://resend.com/domains).
2. Configure DNS records (SPF, DKIM, and DMARC) with your domain provider.
3. Ensure `QUOTE_FROM_EMAIL` uses an email address matching your verified domain (e.g., `system@vinsetpharma.com`).

### 3. Cloudflare Turnstile Setup
1. In Cloudflare Dashboard, create a new Turnstile widget (Managed or Non-interactive).
2. Add your hostnames under **Allowed Domains**:
   - `localhost` (for local development)
   - `127.0.0.1`
   - Your production domain (e.g., `vinsetpharma.com`) and any preview deployment domains.
3. Copy the Site Key to `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the Secret Key to `TURNSTILE_SECRET_KEY`.

---

## Scripts

| Command | Description |
| :--- | :--- |
| `bun run dev` | Starts the Next.js development server with Turbopack. |
| `bun run build` | Builds the production application with typechecking and static generation. |
| `bun run start` | Starts the production server. |
| `bun run test` | Runs the Bun unit test suite. |
| `bun run typecheck` | Validates TypeScript types across the project (`tsc --noEmit`). |
| `bun run check` | Checks formatting and linting rules using Biome. |
| `bun run format` | Automatically formats codebase files using Biome. |
| `bun run lint` | Runs Biome linter check without writing changes. |
| `bun run db:generate` | Generates SQL migrations from Drizzle schemas. |
| `bun run db:migrate` | Applies pending migrations to the database. |
| `bun run db:push` | Directly pushes schema changes to the database (dev only). |
| `bun run db:studio` | Opens Drizzle Studio to inspect database contents locally. |
| `bun run auth:seed-admin` | Seeds the initial admin account using environment credentials. |
| `bun run auth:reset-admin-password` | Resets an admin's password and invalidates active sessions. |

---

## Recovering Admin Access

Because Vinset Pharma is an internal administration portal rather than a consumer web application, **there is no public or email-based password reset flow**. If an administrator loses access, use one of the verified procedures below.

### 1. Forgotten Admin Password (CLI Reset)

To reset an admin password safely without modifying database records manually:

1. Provide the target admin's email and a new temporary password (at least 8 characters) via environment variables.
2. Run the dedicated reset script:

```bash
ADMIN_EMAIL="admin@vinsetpharma.com" \
ADMIN_NEW_PASSWORD="<new-secure-password-8-chars-min>" \
bun run auth:reset-admin-password
```

**Security & Behavior Details:**
- **Strict Validation**: The script refuses to execute without explicit `ADMIN_EMAIL` and `ADMIN_NEW_PASSWORD` credentials.
- **Credential Hygiene**: The new password is encrypted with Better Auth's password hasher (`hashPassword`) and updated directly in the `account` table. The plain password is never printed or logged to stdout/stderr.
- **Session Revocation**: When the password is updated, all active sessions for that admin user are automatically deleted from the `session` table, immediately logging out any stale or unauthorized sessions.
- **Post-Reset**: Remove `ADMIN_NEW_PASSWORD` from your environment or terminal history once completed.

*Alternative Database Re-seed Option*: If you prefer a completely clean slate, you can delete the user record in the `user` table (which cascades to `account` and `session`), and run `bun run auth:seed-admin` to seed a fresh administrator.

### 2. Rotating `BETTER_AUTH_SECRET`

`BETTER_AUTH_SECRET` is used by Better Auth to cryptographically sign session cookies and internal tokens.

- **What rotating invalidates**:
  - **All active user sessions**: Rotating the secret immediately invalidates existing session cookies. Any currently logged-in administrator will be logged out and forced to re-authenticate with their email and password.
- **What rotating DOES NOT affect**:
  - **User accounts and credentials**: Admin user records, emails, names, and password hashes stored in PostgreSQL remain completely intact and valid. Rotating the secret does not alter stored passwords.

---

## Vercel Deployment Guide

### 1. Environment Setup
In your Vercel Project Settings, add all variables listed in `.env.example`:
- Set `APP_URL` to your canonical HTTPS domain (e.g., `https://vinsetpharma.com`).
- Add all server and client secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `S3_*`, `RESEND_*`, `TURNSTILE_*`).

### 2. Database Migrations (Pre-deploy)
Do **not** place migrations inside the Vercel build script. Instead, apply database migrations before deployment directly from your local terminal against the production database:
```bash
DATABASE_URL="<production-db-connection-string>" bun run db:migrate
```

### 3. Initial Admin Seeding
Seed the primary admin account before or immediately after deployment:
```bash
DATABASE_URL="<production-db-connection-string>" \
BETTER_AUTH_SECRET="<production-auth-secret>" \
ADMIN_EMAIL="admin@vinsetpharma.com" \
ADMIN_PASSWORD="<temporary-secure-password>" \
ADMIN_NAME="Administrator" \
bun run auth:seed-admin
```
Once seeded, remove the temporary credentials from your terminal history.

### 4. Deploy
Trigger deployment via GitHub push or Vercel CLI:
```bash
vercel --prod
```

### 5. Post-Deployment Smoke Test Checklist
Verify the live production deployment:
- [ ] **Home Page (`/`)**: HTTP 200, valid metadata title `Vinset Pharma`, structured data JSON-LD present.
- [ ] **Products Catalog (`/products`)**: Displays product cards or clean empty state; pagination works.
- [ ] **Product Detail (`/products/[slug]`)**: Hero packaging image with LCP priority, specifications, related products, and quote form.
- [ ] **Request Quote (`/products/[slug]#request-quote`)**: Turnstile widget loads, validation triggers, successful submission sends notification email.
- [ ] **Blog Listing (`/blog`)**: Article grid renders correctly with date and excerpt.
- [ ] **Blog Detail (`/blog/[slug]`)**: Header image, sanitized article typography, and BlogPosting JSON-LD.
- [ ] **Static Pages (`/about-us`, `/why-us`, `/contact-us`)**: Company info, values, and contact details render without errors.
- [ ] **Admin Login (`/admin/login`)**: Validates admin credentials and redirects to `/admin`.
- [ ] **Admin Dashboard (`/admin`)**: Create/edit/reorder products and categories, write blog posts, manage media showcase, review quote enquiries.
- [ ] **Error Handling**: Visiting `/products/non-existent-slug` returns true HTTP 404. Malformed pages trigger custom error boundary.
- [ ] **SEO & Indexing**:
  - `/robots.txt` disallows `/admin/` and `/api/`, links to sitemap.
  - `/sitemap.xml` returns valid XML with absolute production URLs.
  - `/admin` routes return `Cache-Control: no-store` and `noindex` signals.
