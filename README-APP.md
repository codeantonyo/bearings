# BECO Bearings — full-stack shop

A React + Node/Express + SQLite implementation of the Beco Bearings design.
Extreme-temperature ball bearing store with real accounts, a working cart, an
admin panel, and a checkout that stops right before the card payment gateway
(ready for Stripe).

```
BEARINGS/
├── server/     Express API + SQLite database (auth, products, orders, admin)
├── client/     React (Vite) frontend — all pages from the design
└── project/    The original Claude Design HTML prototype (reference only)
```

## Prerequisites

- Node.js 18+ (built and tested on Node 24)

## Run it (two terminals)

**1. Backend** — creates `server/beco.db`, seeds the catalogue and the admin
account on first start:

```bash
cd server
npm install        # first time only
npm start          # -> http://localhost:4000
```

**2. Frontend:**

```bash
cd client
npm install        # first time only
npm run dev        # -> http://localhost:5173
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` and
`/uploads` to the backend, so no extra configuration is needed.

## Accounts

- **Admin** (pre-seeded): `admin@becobearings.com` / `beco-admin-2026`
  Sign in on the **Account** page → an **ADMIN** link appears in the header.
- **Customers:** anyone can **Sign up** on the Account page.

Change the admin credentials by copying `server/.env.example` to `server/.env`
and editing `ADMIN_EMAIL` / `ADMIN_PASSWORD` **before the first run** (or delete
`server/beco.db` to re-seed).

## What works

- **Auth** — real signup + login (bcrypt-hashed passwords, JWT sessions).
- **Catalogue** — products served from the database, filter by temperature
  class / bore / search.
- **Cart** — add/adjust/remove, persists in the browser, 20 € minimum order.
  A toast notification pops up whenever an item is added.
- **Checkout** — collects shipping details, creates a real order, then shows
  the **card payment step** (disabled placeholder — see below). Includes:
  - **Guest checkout** or an inline **sign-in** (your choice, no account
    required to order).
  - **Country & City** are searchable dropdowns. The lists come live from the
    free [countriesnow.space](https://countriesnow.space) API — cities update
    when you pick a country. Requires internet; if the API is unreachable the
    fields gracefully accept free text.
- **Account** — order history for the signed-in user.
- **Admin panel** (`/admin`, admin only):
  - Add / edit / delete products
  - Edit **price** and **stock** inline, show/hide products
  - **Upload a product photo** (replaces the generated bearing graphic)
  - View all customer orders

## Product photos

Until you upload real photos, each product shows a generated SVG bearing in its
temperature-class colour. In the admin panel, click **PHOTO** on any product row
to upload an image — it's stored in `server/uploads/` and shown everywhere that
product appears.

## Payment gateway (next step — intentionally not wired)

The build stops exactly where you asked: at the card payment step. The checkout
creates an order in `pending_payment` status and renders a card form that's
disabled until Stripe is connected. Full wiring instructions are in
[`server/PAYMENTS.md`](server/PAYMENTS.md).

## Notes

- Database is a single file, `server/beco.db` (SQLite). Delete it to reset all
  data and re-seed.
- `server/.env` is optional; sensible defaults are used if it's absent.
