"use client";

import { useState, useEffect } from "react";
import Index from "@/views/Index";
import Auth from "@/views/Auth";
import { supabase } from "@/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('arc_guest_mode') === 'true') {
      setIsGuest(true);
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state modifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--secondary)]" />
      </div>
    );
  }

  return (session || isGuest) ? <Index /> : <Auth />;
}
