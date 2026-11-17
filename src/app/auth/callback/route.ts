import { NextResponse, type NextRequest } from "next/server";

import { completeSignIn, SIGN_IN_NEXT_PARAM } from "@/features/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const destination = await completeSignIn(
    searchParams.get("code"),
    searchParams.get(SIGN_IN_NEXT_PARAM),
  );
  return NextResponse.redirect(new URL(destination, origin));
}
