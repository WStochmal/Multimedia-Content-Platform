import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import from jose for token verification

interface PayloadProps {
  payload: {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    iat?: number;
    exp?: number;
  };
}

export async function middleware(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  // console.log("Token", token);

  const continueRequest = NextResponse.next();

  if (token) {
    try {
      const payload = await jwtVerify<PayloadProps>(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      // console.log("Payload (middleware)", payload);

      // Attach decoded payload to headers
      continueRequest.headers.set("x-payload", JSON.stringify(payload));
    } catch (error) {
      console.log("Invalid token", error);

      // For protected routes, if the token is invalid, block the request
      if (isProtectedRoute(request)) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
  } else {
    console.log("No token provided");

    // For protected routes, block if no token is provided
    if (isProtectedRoute(request)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return continueRequest;
}

// Helper function to determine if a route is protected
function isProtectedRoute(request: NextRequest): boolean {
  const protectedRoutes = ["/api/upload-media", "/api/list/add"];
  return protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
}

// Config for all matched routes
export const config = {
  matcher: [
    "/api/upload-media",
    "/api/list/add",
    "/api/list/remove",
    "/api/gallery",
  ],
};
