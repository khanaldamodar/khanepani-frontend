import { NextRequest, NextResponse } from "next/server";
import Cookie from "js-cookie";


export function middleware(req: NextRequest) {
  const token = Cookie.get("token")


  // ✅ Protect all /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      // Redirect to login page if token not found
      return NextResponse.redirect(new URL("/user/login", req.url));
    }

    try {
      // ✅ Decode JWT payload
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      // ✅ Check admin role
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("Token decode error:", err);
      return NextResponse.redirect(new URL("/user/login", req.url));
    }
  }

  return NextResponse.next();
}
