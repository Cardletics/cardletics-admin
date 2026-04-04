import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  const username = process.env.ADMIN_BASIC_AUTH_USERNAME;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Admin auth env vars missing", {
      status: 500,
    });
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const base64Credentials = authHeader.split(" ")[1];

  let decodedCredentials = "";

  try {
    decodedCredentials = atob(base64Credentials);
  } catch {
    return new NextResponse("Invalid auth header", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const [inputUser, inputPassword] = decodedCredentials.split(":");

  const isValid =
    inputUser === username && inputPassword === password;

  if (isValid) {
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
  matcher: ["/admin/:path*"],
};