import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid"; // Pakiet do generowania unikalnych identyfikatorów
import sharp from "sharp";

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

    const items: any[] = [];

    // Process form data
    for (let [key, value] of formData.entries()) {
      const match = key.match(/items\[(\d+)\]\[(.+?)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];

        if (!items[index]) {
          items[index] = {};
        }
        if (field === "file") {
          items[index][field] = value as File;
        } else if (field === "tags") {
          items[index][field] = Array.isArray(items[index][field])
            ? items[index][field].concat(value)
            : [value];
        } else {
          items[index][field] = value;
        }
      }
    }

    // Check if all items have file
    for (let item of items) {
      const { file } = item;

      if (!file) {
        return NextResponse.json(
          { message: "File is required" },
          { status: 400 }
        );
      }
    }

    // Process each item

    for (let item of items) {
      const { title, description, tags, file } = item;

      const buffer = Buffer.from(await file.arrayBuffer());
      const metadata = await sharp(buffer).metadata();

      if (!metadata.width || !metadata.height) {
        return NextResponse.json(
          { message: "Invalid image dimensions" },
          { status: 400 }
        );
      }

      const aspectRatio = metadata.width / metadata.height; // Ratio of width to height
      const fileName = `${nanoid()}-${file.name}`;

      // if orginal file >3MB then resize it
      const reducedBuffer = await reduceImageSize(metadata, buffer, 3);

      // thumbanil resize max 1MB, max full HD, and convert to webp format
      const thumbnailBuffer = await sharp(buffer)
        .resize({
          width: 1920, // Maksymalna szerokość
          height: 1920, // Maksymalna wysokość
          fit: "inside", // Zachowanie aspect ratio
        })
        .webp({ quality: 70 }) // Kompresja do formatu WebP
        .toBuffer();

      // save images

      const orginalFilePath = path.join(
        process.cwd(),
        "public",
        "media",
        "orginal",
        fileName
      );
      const thumbnailFileName = fileName.replace(/\.\w+$/, ".webp");
      const thumbnailFilePath = path.join(
        process.cwd(),
        "public",
        "media",
        "thumbnail",
        thumbnailFileName
      );

      await fs.writeFileSync(orginalFilePath, reducedBuffer);
      await fs.writeFileSync(thumbnailFilePath, thumbnailBuffer);

      const media = await prisma.media.create({
        data: {
          title: title || "",
          description: description || "",
          tags: tags || [],
          url: fileName,
          aspectRatio: parseFloat(aspectRatio.toFixed(4)), // Zapisanie aspectRatio
          uploadedById: userId,
        },
      });
    }

    console.log(items);

    return NextResponse.json({ message: "Media uploaded" });
  } catch (error) {
    console.error("Error during media upload:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function reduceImageSize(
  metadata: sharp.Metadata,
  buffer: Buffer,
  maxSizeMB: number
): Promise<Buffer> {
  let quality = 80; // Startowa jakość
  let resizedBuffer = buffer;

  // Powtarzamy dopóki plik nie będzie mniejszy niż wymagany rozmiar
  while (resizedBuffer.length > maxSizeMB * 1024 * 1024 && quality > 10) {
    resizedBuffer = await sharp(buffer)
      .jpeg({ quality }) // Obniżanie jakości JPEG
      .toBuffer();
    quality -= 10; // Zmniejszanie jakości o 10 za każdym razem
  }

  // Jeżeli nadal przekracza 3MB, zmniejszamy wymiary obrazu
  if (resizedBuffer.length > maxSizeMB * 1024 * 1024) {
    resizedBuffer = await sharp(buffer)
      .resize({
        width: Math.floor(metadata.width! * 0.8),
        height: Math.floor(metadata.height! * 0.8),
        fit: "inside",
      }) // Proporcjonalne zmniejszenie rozdzielczości
      .jpeg({ quality: 80 }) // Powrót do startowej jakości
      .toBuffer();
  }

  return resizedBuffer;
}
