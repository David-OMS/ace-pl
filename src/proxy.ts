import type { NextRequest, NextResponse } from "next/server";

import { refreshSession } from "@/lib/supabase/refresh-session";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return refreshSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
