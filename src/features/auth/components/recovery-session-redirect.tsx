"use client";

import { useEffect } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

import { NEW_PASSWORD_PATH } from "../routes";

/** A rejected reset link can land on the home page with the session in the address hash. */
export function RecoverySessionRedirect(): null {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("type") !== "recovery") return;
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    if (!accessToken || !refreshToken) return;

    const supabase = createSupabaseBrowserClient();
    void supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (!error) window.location.assign(NEW_PASSWORD_PATH);
      });
  }, []);

  return null;
}
