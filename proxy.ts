import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic Auth ist deaktiviert.
// Der Adminbereich wird jetzt über Supabase + AdminAuthShell geschützt.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

// Absichtlich auf eine nicht verwendete Route gelegt,
// damit /admin NICHT mehr vom Browser-Basic-Auth-Fenster blockiert wird.
export const config = {
  matcher: ["/__disabled-basic-auth/:path*"],
};
