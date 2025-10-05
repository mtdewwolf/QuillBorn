"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

type SupabaseAuthContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(undefined);

interface SupabaseAuthProviderProps {
  initialSession: Session | null;
  children: ReactNode;
}

export function SupabaseAuthProvider({ initialSession, children }: SupabaseAuthProviderProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [sessionState, setSessionState] = useState<Omit<SupabaseAuthContextValue, "supabase">>(
    () => ({
      session: initialSession,
      user: initialSession?.user ?? null,
      isLoading: !initialSession,
      error: null,
    })
  );

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSessionState({
        session: data.session ?? null,
        user: data.session?.user ?? null,
        isLoading: false,
        error: error ?? null,
      });
    };

    void hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setSessionState((prev) => ({
        ...prev,
        session: session ?? null,
        user: session?.user ?? null,
        isLoading: false,
        error: null,
      }));
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<SupabaseAuthContextValue>(
    () => ({
      supabase,
      ...sessionState,
    }),
    [sessionState, supabase]
  );

  return (
    <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
  );
}

function useSupabaseAuthContext() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("SupabaseAuth hooks must be used within SupabaseAuthProvider");
  }
  return context;
}

export function useSupabaseClient() {
  return useSupabaseAuthContext().supabase;
}

export function useSupabaseSession() {
  const { session, isLoading, error } = useSupabaseAuthContext();
  return { session, isLoading, error };
}

export function useSupabaseUser() {
  return useSupabaseAuthContext().user;
}


