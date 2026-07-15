# Roamify

Roamify is a full-stack tour booking platform where **organizers** can list and manage tours, **travelers** can browse and book them, and **admins** oversee the platform. It's split into two separate projects/repositories: a Next.js frontend and an Express + TypeScript backend, both deployed independently on Vercel.

## Live Demo

- **Frontend:** https://roamify-client-xi.vercel.app
- **Backend API:** https://roamify-server-seven.vercel.app

## Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- HeroUI (`@heroui/react`) component library
- Recharts (analytics/dashboard charts)
- better-auth (authentication)

**Backend**
- Express 5
- TypeScript
- MongoDB (native driver)
- CORS with credentialed cross-origin support

**Deployment**
- Vercel (zero-config Express + Next.js serverless functions)
- MongoDB Atlas

## Project Structure

```
roamify/
├── roamify-client/     # Next.js frontend
│   ├── src/
│   │   ├── app/        # App Router pages (dashboard, explore, bookings, etc.)
│   │   ├── Components/ # Shared UI components
│   │   └── lib/        # API client, auth client helpers
│   └── package.json
│
└── roamify-server/      # Express + TypeScript backend
    ├── index.ts          # Main API entrypoint (tours, bookings, admin routes)
    ├── tsconfig.json
    ├── vercel.json
    └── package.json
```

## Features

- **Role-based access** — `traveler`, `organizer`, and `admin` roles with distinct dashboards and permissions
- **Tour management** — organizers can create, edit, and delete tours
- **Booking system** — travelers can book tours; organizers can confirm/cancel bookings on their own tours
- **Admin dashboard** — platform-wide analytics (signups, revenue, role/booking-status breakdowns) with interactive charts
- **Authentication** — email/password auth via better-auth, with session-based access control

## Getting Started (Local Development)

### Prerequisites
- Node.js 20+
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Backend Setup

```bash
cd roamify-server
npm install
```

Create a `.env` file:

```dotenv
MONGO_DB_URI=your_mongodb_connection_string
DB_NAME=roamify
FRONTEND_URL=http://localhost:3000
```

Run the dev server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd roamify-client
npm install
```

Create a `.env` file:

```dotenv
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000

MONGO_DB_URI=your_mongodb_connection_string
AUTH_BD_NAME=roamify

NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

> **Note:** Never commit `.env` files. Copy `.env.example` (if provided) and fill in your own values. If a credential is ever accidentally exposed (e.g. committed to Git or shared publicly), rotate it immediately in the relevant provider's dashboard (MongoDB Atlas, ImgBB, etc.).

## Environment Variables Reference

### Backend (`roamify-server`)

| Variable | Description |
|---|---|
| `MONGO_DB_URI` | MongoDB connection string |
| `DB_NAME` | Database name (defaults to `roamify`) |
| `FRONTEND_URL` | Deployed frontend origin, used for CORS |

### Frontend (`roamify-client`)

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Secret used to sign session tokens |
| `BETTER_AUTH_URL` | Base URL of the auth handler (this app) |
| `MONGO_DB_URI` | MongoDB connection string (used by the auth adapter) |
| `AUTH_BD_NAME` | Database name for auth collections |
| `NEXT_PUBLIC_IMGBB_API_KEY` | API key for image uploads via ImgBB |
| `NEXT_PUBLIC_BASE_URL` | Deployed backend API URL |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public URL of the auth handler (client-side) |

## Deployment

Both projects deploy independently to Vercel using zero-config detection:

- **Backend** — Express app exported as a default export from `index.ts`; deploys as a single Vercel Function.
- **Frontend** — standard Next.js deployment.

After deploying either project, make sure the corresponding environment variables above are set in that project's Vercel dashboard (**Settings → Environment Variables**) before promoting to production.

## Scripts

**Backend**
```bash
npm run dev     # Start dev server with tsx watch
npm run build   # Compile TypeScript
npm run start   # Run compiled output
```

**Frontend**
```bash
npm run dev     # Start Next.js dev server
npm run build   # Production build
npm run start   # Start production server
```


