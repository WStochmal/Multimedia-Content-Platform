import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  console.log(req, res);

  const data = await response.json();

  return Response.json(data);
}
