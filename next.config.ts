import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Next 15 ne met plus en cache les segments dynamiques côté client
    // (staleTime 0) : chaque retour sur un onglet d'audit refaisait un
    // aller-retour serveur. 30 s suffisent pour naviguer entre onglets.
    staleTimes: {
      dynamic: 30,
    },
  },
}

export default withSentryConfig(nextConfig, {
  org: "timothe-hege",
  project: "javascript-nextjs",
  silent: true,
  telemetry: false,
  sourcemaps: {
    disable: process.env.NODE_ENV !== "production",
  },
})
