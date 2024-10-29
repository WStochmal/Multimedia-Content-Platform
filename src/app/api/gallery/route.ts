// import { prisma } from "../prismaConfig";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prismaConfig";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  console.log("SERVER");
  // // Liczba wyników na stronę i strona do paginacji (opcjonalnie)
  const limit = parseInt(searchParams.get("limit") || "15");

  try {
    const mediaList = await prisma.media.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: true,
      },
    });
    // Delete password from the response
    const sanitizedMediaList = mediaList.map((media) => ({
      ...media,
      uploadedBy: {
        ...media.uploadedBy,
        password: undefined,
      },
    }));

    return NextResponse.json({ media: sanitizedMediaList });
  } catch (error) {
    console.error("Error fetching media list:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
