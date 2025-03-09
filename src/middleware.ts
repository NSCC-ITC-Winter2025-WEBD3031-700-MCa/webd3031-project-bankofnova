import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const { pathname } = req.nextUrl;

    // 🔹 Check role for `/dashboard` and other pages
    if (pathname.startsWith("/dashboard") || 
        pathname.startsWith("/icons") || 
        pathname.startsWith("/utilities/typography") || 
        pathname.startsWith("/sample-page") || 
        pathname.startsWith("/utilities/shadow")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect non-admins to user profile
      }
    }

    // If the user is authenticated, let the request continue
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

// 🔹 Apply middleware to these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/icons/:path*",  // Protect `/icons` pages
    "/utilities/typography/:path*",  // Protect `/utilities/typography` pages
    "/sample-page/:path*",  // Protect `/sample-page` pages
    "/utilities/shadow/:path*"  // Protect `/utilities/shadow` pages
  ],
};
