"use client";

import type { Session } from "@supabase/supabase-js";
import { ReactNode } from "react";

import { SupabaseAuthProvider } from "@/providers/supabase-auth-provider";
import { TelemetryProvider } from "@/providers/telemetry-provider";

interface AppProvidersProps {
  children: ReactNode;
  initialSession: Session | null;
}

export function AppProviders({ children, initialSession }: AppProvidersProps) {
  return (
    <SupabaseAuthProvider initialSession={initialSession}>
      <TelemetryProvider>{children}</TelemetryProvider>
    </SupabaseAuthProvider>
  );
}
