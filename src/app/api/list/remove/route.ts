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

    // Sprawdź, czy mediaId jest na liście
    if (!mediaList.mediaIds.includes(mediaId)) {
      return NextResponse.json(
        { message: "Media is not in the list" },
        { status: 400 }
      );
    }

    // Usuń mediaId z listy
    const updatedMediaIds = mediaList.mediaIds.filter((id) => id !== mediaId);

    await prisma.mediaList.update({
      where: { id: mediaList.id },
      data: {
        mediaIds: updatedMediaIds,
      },
    });

    return NextResponse.json({ message: "Media removed from the list" });
  } catch (error) {
    console.error("Error removing media from the list:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
