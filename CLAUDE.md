# Balise

SaaS d'audit d'accessibilité RGAA 4.1.2 pour cabinets de conseil.

## Stack

| Couche | Outil |
|--------|-------|
| Framework | Next.js 15 App Router + TypeScript strict |
| UI | Tailwind CSS + shadcn/ui (Charts inclus) |
| API | tRPC v11 + TanStack Query |
| ORM | Drizzle ORM |
| Base de données | PostgreSQL 16 |
| Auth | Better Auth + plugin organizations |
| Queue | BullMQ + Redis 7 |
| Scanner | Playwright (Chromium) + axe-core |
| Fichiers | Cloudflare R2 |
| PDF | Playwright print |
| Excel | ExcelJS |
| Emails | Resend |
| Erreurs | Sentry |
| Package manager | pnpm |
