import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
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

module.exports = {
  output: 'standalone',
}
