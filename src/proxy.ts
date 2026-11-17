import { NextResponse, type NextRequest } from "next/server";

import { forwardAuthCode, PASSWORD_RESET_COOKIE } from "@/features/auth/server";
import { refreshSession } from "@/lib/supabase/refresh-session";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const forwarded = forwardAuthCode(
    request.nextUrl,
    request.cookies.get(PASSWORD_RESET_COOKIE)?.value === "1",
  );
  if (forwarded) return NextResponse.redirect(forwarded);
  return refreshSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
