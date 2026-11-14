# BotHosting

A modern Discord bot hosting platform inspired by premium SaaS dashboards like SCNX.xyz.

## Features

- Landing page with pricing and conversion-focused sections
- Secure-looking dashboard UI for bot management
- Bot fleet overview and activity panels
- Billing and admin views
- Bot API routes for health checks and bot creation
- Prisma schema ready for PostgreSQL/SQLite use
- Docker-ready setup

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development

## Quick start

1. Install dependencies:
   npm install
2. Copy environment variables:
   cp .env.example .env
3. Generate Prisma client:
   npx prisma generate
4. Run the dev server:
   npm run dev
5. Open http://localhost:3000

## Production notes

- Replace SQLite with PostgreSQL in production.
- Add real Discord OAuth and Stripe billing integration.
- Replace the demo dashboard with authenticated user data.

## Scripts

- npm run dev
- npm run build
- npm run start
- npm run lint
- npx prisma migrate dev
