# ─── Étape 1 : image de base ──────────────────────────────────────────────────
# On part d'une image Node.js légère (Alpine Linux) et on installe pnpm.
# Cette image "base" est réutilisée par les étapes suivantes.
FROM node:20-alpine AS base
RUN npm install -g pnpm

# ─── Étape 2 : installation des dépendances ───────────────────────────────────
# On installe les node_modules dans une étape isolée pour profiter du cache Docker :
# si package.json ne change pas, Docker ne réinstalle pas tout à chaque build.
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Étape 3 : build de l'application ─────────────────────────────────────────
# On copie les node_modules installés à l'étape précédente, puis le code source,
# et on lance le build Next.js (génère .next/standalone grâce à output: 'standalone').
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ─── Étape 4 : image de production ────────────────────────────────────────────
# Image finale, la plus légère possible : on ne copie que le strict nécessaire
# pour faire tourner l'app (pas le code source, pas les node_modules complets).
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Utilisateur non-root pour la sécurité (bonne pratique en prod)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# On copie les fichiers statiques publics, le serveur standalone, et les assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Le serveur Next.js standalone (généré par output: 'standalone' dans next.config.ts)
CMD ["node", "server.js"]

# ─── Étape 5 : worker de scan ─────────────────────────────────────────────────
# Process séparé qui consomme la file BullMQ et pilote Chromium. Il ne peut pas
# partager l'image ci-dessus : Playwright ne supporte pas Alpine (musl), et
# l'image officielle Playwright embarque déjà le navigateur et ses dépendances
# système. On l'exécute via tsx (les alias @/ du projet), d'où l'installation
# des devDependencies.
FROM mcr.microsoft.com/playwright:v1.60.0-noble AS worker
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --prod=false : tsx est une devDependency et reste nécessaire à l'exécution.
RUN pnpm install --frozen-lockfile --prod=false

COPY tsconfig.json ./
COPY src ./src

# pwuser est fourni par l'image Playwright (non-root, propriétaire du cache des
# navigateurs).
USER pwuser
CMD ["pnpm", "exec", "tsx", "src/worker/index.ts"]
