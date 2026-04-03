import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.headers.get("authorization");

  const username = "lnwbr";
  const password = "Apploginmuhkuh22!";

  const validAuth =
    "Basic " +
    Buffer.from(username + ":" + password).toString("base64");

  if (auth === validAuth) {
    return NextResponse.next();
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
};