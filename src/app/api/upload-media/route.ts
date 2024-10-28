import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid"; // Pakiet do generowania unikalnych identyfikatorów

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const tokenPayload = JSON.parse(req.headers.get("x-payload") || "{}");

  if (!tokenPayload || !tokenPayload.payload?.id) {
    return NextResponse.json(
      { message: "Invalid token payload" },
      { status: 400 }
    );
  }

  const userId = tokenPayload.payload.id;

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const tags = formData.getAll("tags").map((tag) => tag.toString()) || [];
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 }
      );
    }

    // Generowanie unikalnej nazwy pliku
    const uniqueFileName = `${nanoid()}-${file.name}`;
    const filePath = path.join(
      process.cwd(),
      "public",
      "media",
      uniqueFileName
    );

    // Zapisanie pliku na serwerze
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Zapis URL do bazy (ścieżka względna względem katalogu `public`)
    const fileUrl = `/media/${uniqueFileName}`;

    // Zapis danych do bazy
    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        title,
        description,
        tags,
        uploadedById: userId,
      },
    });

    return NextResponse.json({ message: "Media uploaded", media });
  } catch (error) {
    console.error("Error during media upload:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
