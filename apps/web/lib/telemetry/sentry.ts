import * as Sentry from "@sentry/nextjs";

let isBrowserInitialised = false;
let isServerInitialised = false;

const dsn = process.env.SENTRY_DSN;
const analyticsEnabled = Boolean(dsn && process.env.QUILLBORN_ENABLE_ANALYTICS === "true");

export function initSentryServer() {
  if (isServerInitialised || !dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    debug: false,
    enabled: analyticsEnabled,
    environment: process.env.NODE_ENV
  });
  isServerInitialised = true;
}

export function initSentryBrowser() {
  if (typeof window === "undefined" || isBrowserInitialised || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    debug: false,
    enabled: analyticsEnabled,
    environment: process.env.NODE_ENV
  });
  isBrowserInitialised = true;
}
