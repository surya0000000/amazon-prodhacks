# Intent Integrity Layer - Structured Product Discovery

ProdHacks submission prototype built to simulate how Amazon Search could ship an **Intent Integrity Layer** inside the existing marketplace experience.

This project demonstrates how a query like **"oven under $100"** can be interpreted as product intent (core appliance) instead of being polluted by low-cost accessories and duplicate listings.

## Live Demo Links

- **GitHub Pages:** https://surya0000000.github.io/amazon-prodhacks/
- **Vercel:** https://amazon-prodhacks.vercel.app/

## What this project is about

This is not a redesign of Amazon.  
It is a realistic, high-density, Amazon-style UX prototype that shows an incremental product evolution:

- Detect user intent from search query
- Separate **Core Products** from **Accessories**
- Collapse duplicate-like listings into **Canonical Product Clusters**
- Show trust and seller quality signals before purchase decisions
- Keep accessories available, but clearly separated

The goal is to make search results more accurate, transparent, and resilient against listing gaming.

## What the prototype does

### 1) Intent-first search experience
- Search route: `/search?q=oven under 100`
- Intent analysis banner explains why results are being structured
- "Why am I seeing this?" transparency tooltip and modal

### 2) Canonical product cards (image-first)
- Dense Amazon-like grid of clustered appliance options
- Each card shows:
  - Hero image
  - Aggregate rating
  - Price band
  - Seller count
  - Prime/verified-style trust markers
- Click card -> navigates to `/cluster/[clusterId]`

### 3) Cluster detail page (PDP-like flow)
- Large hero image and thumbnail gallery
- Product summary, feature highlights, price context
- Seller table with:
  - Sponsored labels
  - Reliability indicators
  - Delivery speed
  - Verified manufacturer signal
  - Expandable seller rows

### 4) Structured comparison and sorting
- Sort seller options inside each cluster by:
  - Lowest Price
  - Seller Reliability
  - Delivery Speed
- Compare top options side-by-side

### 5) Accessory containment
- Accessory items remain visible in a dedicated section
- Intent validation explains accessory exclusion from core ranking
- Includes intentionally miscategorized low-price items to simulate gaming

### 6) Before / After mode
- Toggle between:
  - Traditional noisy list view
  - Intent Integrity structured view

## Tech Stack

- **Next.js 16** (App Router, static export)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- Client-side mock data only (no backend)

## Image system

To avoid irrelevant stock imagery, the prototype uses deterministic catalog-style media:

- Local curated image catalog in `public/images/catalog`
- Category-specific overlays in `public/images/overlays`
- Reusable `ProductImage` component with:
  - Lazy loading
  - Blur placeholder
  - Error fallback (`/oven-placeholder.jpg`)
  - Consistent square rendering

## Run locally

```bash
npm install
npm run dev
```

Open: http://localhost:3000

### Useful scripts

```bash
npm run dev
npm run build
npm run lint
```

## Key routes

- `/` - simple landing page and category entry points
- `/search?q=oven under 100` - main structured discovery experience
- `/cluster/[clusterId]` - detailed canonical cluster page with seller comparisons

## Submission context

This prototype was built as a **ProdHacks submission** to demonstrate how Amazon Search can:

- Improve result integrity
- Reduce accessory noise in core product intent flows
- Increase trust with visible seller and manufacturer signals
- Keep sponsored and marketplace dynamics transparent within structured clusters
