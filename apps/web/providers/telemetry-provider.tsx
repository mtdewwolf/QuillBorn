"use client";

import { useEffect, type ReactNode } from "react";

import { initLangfuse } from "@/lib/telemetry/langfuse";
import { initSentryBrowser } from "@/lib/telemetry/sentry";

export function TelemetryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initSentryBrowser();
    initLangfuse();
  }, []);

  return <>{children}</>;
}
