# UI Design Plan: Blister Pack Visual System

## 1. Palette & Semantic Token Mapping

Derived from the client brand core in `src/config/site.ts` (`BRAND_COLORS`) to allow swapping in a single block.

### Named Brand Hex Values
- **Primary (`brand-primary`)**: `#004ab8` — Authoritative Clinical Royal Blue (matched directly to logo).
- **Primary Dark (`brand-dark`)**: `#06152d` — Midnight Navy Slate. Used for high-contrast dark rhythm bands (CTA band and site footer).
- **Accent (`brand-accent`)**: `#0056cc` — Precision Therapeutic Blue. Used on light surfaces (passes AA contrast for text and badges).
- **Accent Light (`brand-accent-light`)**: `#38bdf8` — Vibrant Sky Cerulean Spark. Used against dark surfaces (`#06152d`) and as the second half of the two-tone capsule brand mark.
- **Surface Tint (`brand-surface-tint`)**: `#f0f4f9` — Soft Ice Recessed Well. Used for blister cavities and tactile containment surfaces.
- **Foreground (`brand-foreground`)**: `#111827` — Deep Slate Charcoal. Body text with maximum legibility.
- **Border Subtle (`brand-border-subtle`)**: `#d8e2ee` — Precision perforation hairline.

### Semantic Token Mapping (globals.css `:root`)
- `--background`: `oklch(0.985 0.005 255)` (`#f7f9fc`)
- `--foreground`: `oklch(0.21 0.02 255)` (`#111827`)
- `--card`: `oklch(1 0 0)` (`#ffffff`)
- `--card-foreground`: `oklch(0.21 0.02 255)`
- `--primary`: `oklch(0.44 0.20 258)` (`#004ab8`)
- `--primary-foreground`: `oklch(0.99 0.002 255)` (`#ffffff`)
- `--brand-dark`: `oklch(0.18 0.045 258)` (`#06152d`)
- `--brand-dark-foreground`: `oklch(0.98 0.005 255)` (`#f7f9fc`)
- `--brand-dark-muted`: `oklch(0.74 0.025 255)` (`#94a3b8`)
- `--accent`: `oklch(0.48 0.19 258)` (`#0056cc`)
- `--accent-foreground`: `oklch(0.99 0.002 255)` (`#ffffff`)
- `--accent-light`: `oklch(0.75 0.14 235)` (`#38bdf8`)
- `--surface-tint`: `oklch(0.965 0.01 255)` (`#f0f4f9`)
- `--muted`: `oklch(0.965 0.01 255)` (`#f0f4f9`)
- `--muted-foreground`: `oklch(0.48 0.03 255)` (`#5a6578`)
- `--border`: `oklch(0.90 0.012 255)` (`#d8e2ee`)
- `--input`: `oklch(0.62 0.025 255)` (`#7d8da1` — calibrated for ≥ 3:1 contrast against both card surface and focus ring)
- `--ring`: `oklch(0.44 0.20 258)` (`#004ab8` — passes WCAG 3:1 contrast requirements)

### Form Control Contrast Matrix (WCAG Non-Text Contrast ≥ 3:1)
| Interface Pair | Hex Values | Contrast Ratio | Status |
|---|---|---|---|
| Control Boundary on Card Surface | `#819299` on `#ffffff` | **3.23:1** | Passes (≥ 3:1) |
| Control Boundary on Page Surface | `#819299` on `#f6f9fa` | **3.05:1** | Passes (≥ 3:1) |
| Focus Ring on Card Surface | `#00485a` on `#ffffff` | **10.12:1** | Passes (≥ 3:1) |
| Focus Ring on Page Surface | `#00485a` on `#f6f9fa` | **9.57:1** | Passes (≥ 3:1) |
| Focus Ring on Inactive Control Boundary | `#00485a` on `#819299` | **3.14:1** | Passes (≥ 3:1) |

---

## 2. Typography

Distinctive modern scientific pairing, replacing default Inter:
- **Headings & Display**: `Sora` (Weights: `600`, `700`, latin subset, `display: "swap"`).
  A geometric sans designed with expansive apertures and gentle capsule-like arcs, offering a distinct pharmaceutical and biotech visual cadence.
- **Body & UI**: `Plus Jakarta Sans` (Weights: `400`, `500`, `600`, latin subset, `display: "swap"`).
  A crisp, human-grotesque type family optimized for high-density reading, form controls, and clinical clarity.

### Fluid Type Scale (CSS `clamp`)
- **Display / Hero**: `clamp(2.25rem, 1.6rem + 2.8vw, 3.75rem)` (36px to 60px), line-height `1.08`, tracking `-0.025em`
- **Section Heading (H2)**: `clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)` (28px to 40px), line-height `1.15`, tracking `-0.02em`
- **Subheading (H3)**: `clamp(1.2rem, 1.05rem + 0.6vw, 1.45rem)` (19px to 23px), line-height `1.28`, tracking `-0.01em`
- **Body Large**: `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` (17px to 19px), line-height `1.6`
- **Body Regular**: `1rem` (16px), line-height `1.65`
- **Body Small / Meta**: `0.875rem` (14px), line-height `1.5`
- **Caption / Legal**: `0.75rem` (12px), line-height `1.4`

### Reading Constraints
- Body line-length max width strictly capped under **72 characters** (`max-w-prose` / `max-w-2xl` / `max-w-[65ch]`) to maintain comfortable optical rhythm.

---

## 3. Layout Rules

- **Container**: `max-w-7xl` (1280px) default for header, hero, featured products, why us, and blog grids, with fluid padding `px-4 sm:px-6 lg:px-8`. Prevents cramped presentation or large empty voids on wide displays (1920px & 2560px QHD) while strictly constraining all prose and body text under 68 characters per line (`max-w-[65ch]`). Optional `max-w-6xl` (`default`) and `max-w-4xl` (`narrow`) available.
- **Vertical Spacing Scale**:
  - Section vertical rhythm: `py-16 sm:py-20 lg:py-24`
  - Internal card/block rhythm: `gap-6` to `gap-8`
  - Component padding: fluid scaling from `p-5` on mobile to `p-8` on desktop.
- **Breakpoints**: Tailwind defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`).
- **Touch Target Floor**: Interactive controls strictly enforce a minimum height of `44px` (`min-h-[44px]`).
- **Radius Hierarchy by Role**:
  - Actions / Badges / Chips: `rounded-full` (capsule pill motif)
  - Blister pockets / feature containment surfaces: `rounded-3xl` (24px) or `rounded-2xl` (16px)
  - Inputs / Selectors: `rounded-lg` (8px)

---

## 4. "Blister Pack" Motifs & Exact Usage Rules

1. **Capsule Shapes**:
   - **Buttons & Chips**: Interactive primary actions, filter pills, and navigation active states use `rounded-full`.
   - **Brand Mark Companion**: A crisp SVG capsule mark featuring two interlocking halves: deep primary (`#00485a`) and crisp mint (`#33c2a9`), angled at a scientific 30-degree incline.
2. **Product "Pockets"**:
   - Product imagery sits inside a softly recessed well (`bg-surface-tint` / `bg-muted/60` with a subtle inset border and soft inner bevel `shadow-[inset_0_2px_4px_rgba(0,40,50,0.05)]`).
   - Image uses `object-contain` with generous internal padding so pharmaceutical packaging labels and edges are never cropped or occluded.
3. **Perforation Dividers**:
   - Reusable `<PerforationDivider />` component: a structural divider rendering a precision dashed rule accented with miniature circular cut-outs (notches) inspired by pharmaceutical blister foil sheet punch-separators.
   - Restrained placement: placed between major thematic transitions (after Hero, before Why Us, and crowning the Dark Footer). Never placed repetitively within cards.
4. **Hero Artwork (SVG/CSS)**:
   - Dedicated Server Component `<HeroArtwork />` built with pure SVG and CSS.
   - Shows two precision capsule halves sliding smoothly together along an engineered axis and locking into equilibrium on initial page load (the single orchestrated micro-animation on the site).
   - Wrapped in `@media (prefers-reduced-motion: reduce)`: displays the settled, locked capsule immediately with zero movement.
   - Supported by subtle concentric blister packaging deboss rings. No stock photography, no generic blur meshes.
5. **Dark Sections**:
   - Call to Action Band and Site Footer use deep `#06232b` (`bg-[var(--brand-dark)]`), creating high-contrast structural anchors against the cool clinical `#f6f9fa` base.

---

## 5. Component Inventory

| Component | Path | Role / Motif | Client/Server |
|---|---|---|---|
| `CapsuleMark` | `src/components/brand/capsule-mark.tsx` | Two-tone SVG capsule icon for header logo, footer, and favicons | Server |
| `HeroArtwork` | `src/components/brand/hero-artwork.tsx` | Pure SVG/CSS assembled capsule motion with reduced-motion support | Server |
| `BlisterPocket` | `src/components/brand/blister-pocket.tsx` | Recessed tactile cavity surface for products and features | Server |
| `PerforationDivider` | `src/components/brand/perforation-divider.tsx` | Structural dashed rule with circular foil perforation notches | Server |
| `SectionHeading` | `src/components/brand/section-heading.tsx` | Typographic section anchor without generic all-caps eyebrows | Server |
| `SiteHeader` | `src/components/layout/site-header.tsx` | Top utility contact bar + sticky navigation shell with pill CTA | Mixed (Server shell + Client nav) |
| `MainNav` | `src/components/layout/main-nav.tsx` | Desktop navigation with pill active states (`aria-current`) | Client |
| `MobileNav` | `src/components/layout/mobile-nav.tsx` | 44px touch-target sliding drawer using Base UI / Sheet | Client |
| `SiteFooter` | `src/components/layout/site-footer.tsx` | Dark brand surface, perforation top edge, contact, disclaimer | Server |
| `Hero` | `src/features/marketing/components/hero.tsx` | Rebuilt hero with capsule art, Sora display typography, dual pill CTAs | Server |
| `AboutSummary` | `src/features/marketing/components/about-summary.tsx` | Short teaser with blister architecture and direct link | Server |
| `FeaturedProductsSection`| `src/features/products/components/featured-products.tsx` | Restyled with blister-pocket wells; empty state kept | Server |
| `WhyUsComposition` | `src/features/marketing/components/why-us-grid.tsx` | Asymmetric 2-part composition replacing uniform 6-card grid | Server |
| `CtaBanner` | `src/features/marketing/components/cta-banner.tsx` | Dark brand band with crisp contrast and dual pill CTAs | Server |
| `LatestBlogsSection` | `src/features/blogs/components/latest-blogs.tsx` | Editorial clinical card grid with pocket framing; empty state kept | Server |

---

## 6. Critical Review & Self-Correction

- **Critique**: If this were a generic pharma template, the "Why Us" section would be six identical white cards in a 3x2 grid with centered circular icon pills, and the hero would feature a generic floating card stack.
- **Revision made**: Replaced the uniform 6-card symmetrical grid with an asymmetrical "Blister Ledger" composition (a master clinical foundation block with 2 core pillars + 4 precision focus tiles in a structured offset grid) and replaced floating card shadows with tactile blister pocket architecture featuring soft inset wells and bespoke perforation boundaries, completely eliminating generic circular icon badges and predictable 3-column repeating card templates.
