# Revora — Marketing Site

The Stripe-native retention platform. Landing page built with Next.js App
Router, TypeScript, Tailwind CSS v4, and shadcn/ui conventions.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  layout.tsx        Root layout, Geist font, metadata
  page.tsx           Composes all sections
  globals.css        Design tokens (Tailwind v4 @theme) + base styles
components/
  layout/            navbar.tsx, footer.tsx
  marketing/         one component per landing-page section
  common/            container, section-heading, logo, reveal (scroll-in motion)
  ui/                shadcn-style primitives: button, badge, card, accordion
```

## Design tokens

All colors, radii, and fonts live in `app/globals.css` under `@theme`.
Change `--color-accent` there to re-theme the whole site from one place.

## Adding more shadcn/ui components

This project is pre-configured with `components.json`, so you can pull in
additional primitives with the shadcn CLI:

```bash
npx shadcn@latest add dialog
```
