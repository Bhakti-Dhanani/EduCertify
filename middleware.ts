import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "./lib/constants";

// Paths that do not require authentication
const publicPaths = [
  ROUTES.HOME,
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  "/auth/error",
  "/api/auth",
];

// Define role-based path prefixes
const rolePaths = {
  ADMIN: ["/admin"],
  INSTRUCTOR: ["/instructor"],
  STUDENT: ["/student"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Get the user's token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // If there's no token, redirect to login
  if (!token) {
    const url = new URL(ROUTES.SIGN_IN, request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Check role-based access
  const userRole = token.role as keyof typeof rolePaths || "STUDENT";
  
  // Check if user is trying to access a role-specific area they don't have access to
  for (const [role, paths] of Object.entries(rolePaths)) {
    if (role !== userRole && paths.some(path => pathname.startsWith(path))) {
      // If unauthorized, redirect to their appropriate dashboard
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url));
      } else if (userRole === "INSTRUCTOR") {
        return NextResponse.redirect(new URL(ROUTES.INSTRUCTOR.DASHBOARD, request.url));
      } else {
        return NextResponse.redirect(new URL(ROUTES.STUDENT.DASHBOARD, request.url));
      }
    }
  }
  
  // Restrict access to /dashboard routes for unauthenticated users
  const isAuthenticated = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
  // Redirect unauthenticated users to the homepage instead of the sign-in page
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes that don't need auth (except auth API)
    // - Static files (_next, favicon, etc)
    // - Public files
    "/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth)).*)",
    "/dashboard/:path*",
  ],
};