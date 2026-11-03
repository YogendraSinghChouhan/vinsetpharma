# vinset Pharma Website — Product Overview

## What we're building

A marketing and product-showcase website for **vinset Pharma**, modeled on the feature set of deeparpharma.com. Visitors learn about the company, browse its pharmaceutical products, read blog articles, and send a request for quote. A single admin-only dashboard lets the company manage products and blogs.

This is not a store. There is no cart, checkout, payments, or public user accounts.

## Goals

- Present vinset Pharma as a credible pharma business
- Showcase the product range clearly and let buyers request a quote
- Rank well in search through fast, SEO-friendly pages and a blog
- Let the client manage products and blogs without developer help

## Users

| User | What they do |
|---|---|
| Visitor / buyer | Browses pages, products and blogs, submits a quote request |
| Admin | Logs in to manage products, blogs and quote requests |

There is only one role (admin). No public signup or login.

## Scope

### 1. Static pages
Basic informational pages with fixed content (Home, About, Contact, and similar). Content lives in code, not in the dashboard.

### 2. Product showcase and categories (dynamic)
- Product listing page, product detail page, and category listing
- Each product belongs to one category
- Each product has: **category, image, title, tagline, description**
- No pricing, stock, variants or cart
- Each product detail page has a **Request a Quote** form

### 3. Blogs (dynamic)
- Blog listing page and blog detail page
- Admin writes and publishes posts with a cover image, title, slug, rich content and SEO fields

### 4. Request a Quote form
- Submitted from the product pages
- Saved to the database and emailed to the company
- Spam protected

### 5. Media showcase (dynamic)
- Photos and videos showcasing laboratory, preparation facilities, quality testing and pharmaceutical operations
- Public Media page displays photos and videos in custom admin-curated order
- Visitors can view full-size images and play videos with browser-native controls

### 6. Admin dashboard (admin only)
- Secure login
- **Products:** create, edit, delete, reorder, publish/unpublish, mark up to 8 published products as featured for the home page
- **Categories:** create, edit, delete, reorder
- **Blogs:** create, edit, delete, publish/unpublish
- **Media:** upload photos and videos, arrange by drag and drop, edit captions, delete
- **Quote requests:** view list and details, mark status (new / contacted)

## Out of scope

- Any CMS (the admin is custom-built)
- E-commerce, payments, carts, orders
- Public user accounts, roles or permissions beyond a single admin
- Any other dynamic feature beyond products, categories, blogs, quote requests and media
- Multi-language support

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router, `src/` folder) |
| Runtime / package manager | Bun |
| Database | Neon PostgreSQL |
| ORM | Drizzle |
| Auth | Better Auth (admin only, no signup) |
| UI | shadcn/ui + Tailwind |
| Forms / validation | TanStack Forms + Zod |
| Image storage | S3 Compatible |
| Email | React Email + Resend |
| Hosting | Vercel |

## Architecture approach

- **Feature-based folder structure:** each feature (`products`, `categories`, `blogs`, `quotes`, `auth`) owns its actions, data access, validation, types and components
- **Rendering:** public pages are static/ISR, revalidated when the admin publishes or edits content
- **Security:** the admin routes are protected at the data layer, with the middleware redirect only as a UX convenience

## Data model (high level)

- `categories`: name, slug, image key, sort order, timestamps
- `products`: category reference (`categoryId`), image, title, tagline, description, slug, sort order, published, featured
- `posts`: cover image, title, slug, content, SEO fields, published, timestamps
- `quote_requests`: product reference, name, email, phone, message, status, timestamp
- `media`: type (image/video), file key, poster key (videos), width, height, duration (videos), caption, sort order, timestamp
- `users` / `sessions`: admin authentication (managed by Better Auth)

## Non-functional requirements

- Fast load times and optimized images
- Mobile-first responsive design
- SEO: metadata, sitemap, robots, Open Graph, structured data on blogs and products
- Accessible, clean, professional design suited to a pharma brand

## Success criteria

- The admin can publish a product or blog post in under two minutes
- Every quote request reaches the company by email and is stored in the dashboard
- Public pages score well on Core Web Vitals
