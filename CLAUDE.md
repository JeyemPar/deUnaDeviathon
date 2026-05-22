# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Mobile-first banking UI prototype ("deuna - Banca Digital") in Spanish. Bootstrapped with v0 and linked to a v0 project (`prj_VIcS6Iyu9U7U4mULmsLWtOQkL9bH`) — **edits made in v0 push commits directly to this repo, and every merge to `main` auto-deploys**. Keep this in mind: a human collaborator may overwrite manual changes via v0, and vice versa.

UI copy is in Spanish; preserve language when editing user-facing strings.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

```bash
pnpm dev      # next dev — http://localhost:3000
pnpm build    # next build
pnpm start    # production server
pnpm lint     # eslint .
```

No test framework is configured.

## Architecture

**Next.js 16 App Router + React 19 + Tailwind v4 + shadcn/ui** (style: `new-york`, base color `neutral`, icons: `lucide-react`). Path alias `@/*` maps to the repo root.

### Page composition pattern

Routes under `app/` are thin shells that compose feature components — they own layout/structure only, not behavior:

- `app/page.tsx` — banking home, composes `components/banking/*` (Header, BalanceCard, PromoCarousel, QuickActionsGrid, QRButton, BottomNavigation).
- `app/scanner/page.tsx` — QR scanner screen, composes `components/scanner/*` (ScannerHeader, ScannerFrame, InstructionText, PaymentCodeButton).

When adding a screen, follow this split: page = composition + layout, feature components in `components/<feature>/`.

### Component layers

- `components/banking/` — home-screen feature widgets.
- `components/scanner/` — QR scanner UI. Real camera scanning lives in `qr-scanner.tsx` using `html5-qrcode`; the current scanner page uses a static mock (`qr-mock-payment.tsx`) per recent commits, so the real scanner is wired but inactive on the route.
- `components/mobile-frame/` — phone-shaped chrome (`MobileShell`, `StatusBar`) for previewing the app inside a device frame on desktop. Not currently used by `app/layout.tsx` — the root layout renders content fullscreen.
- `components/ui/` — shadcn/ui primitives. Add new primitives via the shadcn CLI rather than hand-rolling.

### Mobile-app styling conventions

`app/globals.css` is not just theme tokens — it defines the **mobile app shell**:

- `html, body` are locked to `height: 100%; overflow: hidden; overscroll-behavior: none; user-select: none` to feel native. Don't add page-level scroll; scroll inside `.overflow-y-auto` regions.
- `.mobile-container` (`flex flex-col`, `height: 100dvh`) is the root wrapper used by every page. Use it for new screens.
- `.scrollbar-hide` for scroll regions that should not show a scrollbar.
- Theme uses OKLCH CSS variables wired through Tailwind v4's `@theme inline` block; the primary purple is `#5B2393` (used directly in `bottom-navigation.tsx`).
- Use `cn()` from `lib/utils.ts` (`clsx` + `tailwind-merge`) for conditional class composition.

### Build/runtime quirks

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` — TS errors do **not** block `pnpm build`. Run `tsc --noEmit` (or rely on the editor) to actually surface type errors. Don't rely on `next build` as a type check.
- `app/layout.tsx` only mounts `@vercel/analytics` in production (`NODE_ENV === 'production'`).
- Root HTML `lang="es"`; viewport pinned (`maximumScale: 1, userScalable: false`) — intentional for the mobile-app feel.
- v0 runtime files (`__v0_*`) are gitignored — leave them alone if they appear locally.
