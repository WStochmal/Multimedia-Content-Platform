import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { listName, mediaId } = await req.json();
    const tokenPayload = JSON.parse(req.headers.get("x-payload") || "{}");

    console.log(tokenPayload);

    const userId = tokenPayload.payload.id;

    // Znajdź listę na podstawie nazwy i użytkownika
    const mediaList = await prisma.mediaList.findFirst({
      where: {
        userId,
        name: listName,
      },
    });

    // Jeśli lista nie istnieje, zwróć błąd
    if (!mediaList) {
      return NextResponse.json(
        { message: `List '${listName}' does not exist` },
        { status: 404 }
      );
    }

    // Sprawdź, czy zdjęcie jest już w liście
    if (mediaList.mediaIds.includes(mediaId)) {
      return NextResponse.json(
        { message: "Media is already in the list" },
        { status: 400 }
      );
    }

    // Dodaj zdjęcie do listy
    await prisma.mediaList.update({
      where: { id: mediaList.id },
      data: {
        mediaIds: [...mediaList.mediaIds, mediaId],
      },
    });

    return NextResponse.json({ message: "Media added to the list" });
  } catch (error) {
    console.error("Error adding media to the list:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
