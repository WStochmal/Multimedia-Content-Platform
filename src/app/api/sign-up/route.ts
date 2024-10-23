import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// !TODO - move prisma to separate file;validate data; catch exceptions, and handle them (unique email, etc)

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const name = formData.get("name")?.toString() || "";
    const avatar = formData.get("avatar") as File | null;

    if (!validateData(email, password)) return;

    const avatarName = email.split("@")[0] + ".png";
    if (avatar) {
      const filePath = path.join(process.cwd(), "public", "avatar", avatarName);
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // save user to database
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          avatar: avatarName,
        },
      });
      console.log("User has been added", user);
    } catch (e) {
      console.log(e);
    }

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Error while transfering data to database ", error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}

function validateData(email: string, password: string) {
  if (!email || !password || email === "" || password === "") {
    console.log("Email and password are required");
    return false;
  }
  return true;
}
