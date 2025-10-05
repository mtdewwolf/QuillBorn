"use client";

import { useSupabaseSession as useAuthSession, useSupabaseUser as useAuthUser } from "@/providers/supabase-auth-provider";

export function useSupabaseSession() {
  return useAuthSession();
}

export function useSupabaseUser() {
  return useAuthUser();
}
