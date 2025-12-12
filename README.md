# FastKart - Courier Management System

A sleek, minimal courier management web application for small courier firms. Includes an internal parcel management dashboard and public parcel tracking pages.

## Tech Stack

- **Next.js 16** (App Router)
- **MongoDB** with Mongoose
- **TanStack Query** for data fetching
- **TailwindCSS** for styling
- **Zod** for validation
- **JWT** for authentication (httpOnly cookies)

## Features

- **Authentication**: Secure email/password login with JWT tokens stored in httpOnly cookies
- **Dashboard**: Stats overview, status distribution chart, daily parcel counts, recent activity
- **Parcel Management**: Create, update, delete parcels with full CRUD operations
- **Data Table**: Search, filter by status, pagination
- **Parcel Detail**: Status timeline, quick status updates, edit info, copy public link
- **Public Tracking**: Customer-friendly tracking page at `/parcel/[id]` (no login required)
- **Security**: Rate limiting, Zod validation, protected routes, UUID-based public IDs

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (use a long random string)

### 3. Seed the owner user (development only)

Start the dev server:

```bash
npm run dev
```

Then call the seed endpoint:

```bash
curl -X POST "http://localhost:3000/api/dev/seed-owner" \
  -H "x-seed-secret: your-seed-secret"
```

This creates an owner account with the credentials from your `.env.local`.

### 4. Login

Visit `http://localhost:3000/login` and sign in with:
- Email: `owner@example.com` (or your `SEED_OWNER_EMAIL`)
- Password: `changeme123` (or your `SEED_OWNER_PASSWORD`)

## Project Structure

```
src/
├── app/
│   ├── (admin)/           # Protected admin routes
│   │   ├── dashboard/     # Stats & overview
│   │   ├── parcels/       # Parcel list & detail
│   │   └── layout.tsx     # Admin shell with sidebar
│   ├── api/
│   │   ├── auth/          # login, logout, me
│   │   ├── parcels/       # CRUD + stats
│   │   ├── public/        # Public parcel endpoint
│   │   └── dev/           # Dev-only seed endpoint
│   ├── login/             # Login page
│   └── parcel/[id]/       # Public tracking page
├── components/
│   ├── providers/         # QueryClient provider
│   └── ui/                # Toast component
├── contexts/
│   └── auth-context.tsx   # Auth state management
├── hooks/
│   └── use-parcels.ts     # TanStack Query hooks
└── lib/
    ├── auth.ts            # JWT sign/verify
    ├── auth-helpers.ts    # Server-side auth helpers
    ├── db.ts              # MongoDB connection
    ├── models/            # Mongoose models
    ├── rate-limit.ts      # Rate limiting
    ├── utils.ts           # Helpers
    └── validators/        # Zod schemas
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/parcels` | List parcels (with search, filter, pagination) |
| POST | `/api/parcels` | Create parcel |
| GET | `/api/parcels/stats` | Dashboard statistics |
| GET | `/api/parcels/[id]` | Get parcel detail |
| PATCH | `/api/parcels/[id]` | Update parcel |
| DELETE | `/api/parcels/[id]` | Delete parcel |
| GET | `/api/public/parcel/[id]` | Public parcel info (sanitized) |

## Parcel Statuses

- `PENDING` - Waiting to be picked up
- `PICKED_UP` - Collected by courier
- `IN_TRANSIT` - On the way
- `OUT_FOR_DELIVERY` - Final delivery attempt
- `DELIVERED` - Successfully delivered
- `RETURNED` - Returned to sender

## Security

- JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
- Rate limiting on write operations
- Zod validation on all API inputs
- UUID-based public IDs (prevents enumeration)
- Sensitive fields hidden from public endpoints
- Middleware-based route protection
