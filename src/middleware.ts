// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import from jose instead of jsonwebtoken (jsonwebtoken uses crypto which is not suported in egde middleware)

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
  console.log("Token", token);

  if (!token) {
    console.log("No token provided");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const payload = await jwtVerify<PayloadProps>(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    ); // Encode the secret to Uint8Array);

    const continueRequest = NextResponse.next();

    console.log("Payload", payload);

    continueRequest.headers.set("x-payload", JSON.stringify(payload));

    return continueRequest;
  } catch (error) {
    console.log(error);
    console.log("Invalid token");
    return NextResponse.next();
  }
}

// config for protected routes
export const config = {
  matcher: ["/api/upload-media"],
};
