import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0,
  debug: false,
  beforeSend(event) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Sentry]", event)
      return null
    }
    return event
  },
})
