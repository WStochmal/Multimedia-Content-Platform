import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
// !TODO - move prisma to separate file;validate data; catch exceptions,check if user exists

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    console.log("Email:", email);

    if (!validateLoginData(email, password)) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    // !TODO - check if user exists
    if (!user) return;
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    // !TODO - refactor to send and receive just the token
    return NextResponse.json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function validateLoginData(email: string, password: string) {
  if (!email || !password || email === "" || password === "") {
    console.log("Email and password are required");
    return false;
  }
  return true;
}

function generateToken(user: {
  id: number;
  email: string;
  name: string;
  avatar: string;
}) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };

  const options = {
    expiresIn: "48h",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, options);

  return token;
}
