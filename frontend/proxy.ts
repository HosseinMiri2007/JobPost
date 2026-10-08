import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedParams: string[] = [
  "keyword",
  "location",
  "page",
  "education",
  "experience",
  "salary",
  "jobType",
];

// list of routes that require login
const protectedRoutes = ["/auth/userupdates", "/auth/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- job 1: clean up query params on the homepage ---
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    let changed = false;
    const keys = Array.from(url.searchParams.keys());

    for (const key of keys) {
      if (!allowedParams.includes(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }

    if (changed) {
      return NextResponse.redirect(url);
    }
  }

  // --- job 2: auth gate on protected routes ---
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    const token = request.cookies.get("access")?.value;
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/dashboard/:path*", "/auth/updateuser/:path*"],
};
