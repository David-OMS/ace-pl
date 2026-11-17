import { NextResponse, type NextRequest } from "next/server";

import {
  completeSignIn,
  NEW_PASSWORD_PATH,
  PASSWORD_RESET_COOKIE,
  SIGN_IN_NEXT_PARAM,
} from "@/features/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const isReset = request.cookies.get(PASSWORD_RESET_COOKIE)?.value === "1";
  const destination = await completeSignIn(
    searchParams.get("code"),
    isReset ? NEW_PASSWORD_PATH : searchParams.get(SIGN_IN_NEXT_PARAM),
  );
  const response = NextResponse.redirect(new URL(destination, origin));
  if (isReset) response.cookies.set(PASSWORD_RESET_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
