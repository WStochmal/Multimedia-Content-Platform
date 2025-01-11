import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../prismaConfig";
import { recommendedMediaList } from "./_utils/gallery_recommended";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenPayload = JSON.parse(req.headers.get("x-payload") || "{}");

  const limit = parseInt(searchParams.get("limit") || "15");
  const page = parseInt(searchParams.get("page") || "1");
  const offset = (page - 1) * limit;
  const imageType = searchParams.get("imageType") || "default";
  const searchValue = searchParams.get("searchValue") || "";

  try {
    if (imageType === "default") {
      if (searchParams.get("type") !== "recommended") {
        return defaultMediaList();
      } else {
        return recommendedMediaList(
          tokenPayload,
          limit,
          page,
          offset,
          searchValue,
          prisma,
          NextResponse
        );
      }
    } else if (imageType === "favourite") {
      return favouriteMediaList();
    } else if (imageType === "mine") {
      return mineMediaList();
    } else {
      return NextResponse.json(
        { message: "Invalid imageType" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching media list:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  async function defaultMediaList() {
    const mediaList = await prisma.media.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: true,
      },
      where: {
        OR: [
          {
            uploadedBy: {
              name: {
                contains: searchValue,
                mode: "insensitive", // Niewrażliwe na wielkość liter
              },
            },
          },
          {
            title: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: searchValue, // Sprawdza, czy tag istnieje w tablicy
            },
          },
        ],
      },
    });

    // Jeśli użytkownik jest zalogowany, sprawdź jego listę ulubionych
    let favouriteMediaIds = [];
    if (tokenPayload.payload?.id) {
      console.log("User is logged in");
      const favouriteList = await prisma.mediaList.findFirst({
        where: {
          userId: tokenPayload.payload.id,
          name: "Favourites",
        },
        select: {
          mediaIds: true, // Pobierz tylko ID mediów
        },
      });

      if (favouriteList) {
        console.log("Favourite list:", favouriteList);
        favouriteMediaIds = favouriteList.mediaIds;
      }
    }

    // Usuń rozszerzenie z URL i dodaj parametr isFavourite
    const mediaListWithDetails = mediaList.map((media) => ({
      ...media,
      url: media.url.replace(/\.[^/.]+$/, ""), // Usuń rozszerzenie
      orginalUrl: media.url,
      isFavourite: favouriteMediaIds.includes(media.id), // Dodaj isFavourite
    }));

    // Usuń pole password z użytkownika
    const sanitizedMediaList = mediaListWithDetails.map((media) => ({
      ...media,
      uploadedBy: {
        ...media.uploadedBy,
        password: undefined,
      },
    }));

    return NextResponse.json({ media: sanitizedMediaList });
  }

  async function favouriteMediaList() {
    // Pobierz listę ID mediów w ulubionych
    const favouriteList = await prisma.mediaList.findFirst({
      where: {
        userId: tokenPayload.payload.id,
        name: "Favourites",
      },
      select: {
        mediaIds: true, // Pobierz tylko ID mediów
      },
    });

    // Jeśli lista ulubionych istnieje, pobierz szczegóły mediów
    if (favouriteList && favouriteList.mediaIds.length > 0) {
      console.log("Favourite list:", favouriteList);

      // Pobierz szczegóły mediów, które są w ulubionych
      const mediaList = await prisma.media.findMany({
        where: {
          id: {
            in: favouriteList.mediaIds, // Filtruj po ID mediów w ulubionych
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          uploadedBy: true,
        },
      });

      // Usuń rozszerzenie z URL i dodaj parametr isFavourite
      const mediaListWithDetails = mediaList.map((media) => ({
        ...media,
        url: media.url.replace(/\.[^/.]+$/, ""), // Usuń rozszerzenie
        orginalUrl: media.url,
        isFavourite: true, // Wszystkie media w ulubionych są oznaczone jako "isFavourite"
      }));

      // Usuń pole password z użytkownika
      const sanitizedMediaList = mediaListWithDetails.map((media) => ({
        ...media,
        uploadedBy: {
          ...media.uploadedBy,
          password: undefined,
        },
      }));

      return NextResponse.json({ media: sanitizedMediaList });
    }
    async function mineMediaList() {
      return NextResponse.json(
        { message: "Invalid imageType" },
        { status: 400 }
      );
    }
  }

  async function mineMediaList() {
    // Pobierz media dodane przez zalogowanego użytkownika
    const mediaList = await prisma.media.findMany({
      where: {
        uploadedById: tokenPayload.payload.id, // Filtruj po ID użytkownika
      },
      take: limit, // Ogranicz liczbę wyników
      skip: offset, // Obsługa paginacji
      orderBy: { createdAt: "desc" }, // Sortuj od najnowszych
      include: {
        uploadedBy: true, // Dołącz dane o użytkowniku, który dodał media
      },
    });

    // Usuń rozszerzenie z URL i dodaj parametr isMine (dodatkowe oznaczenie)
    const mediaListWithDetails = mediaList.map((media) => ({
      ...media,
      url: media.url.replace(/\.[^/.]+$/, ""), // Usuń rozszerzenie z URL
      orginalUrl: media.url, // Oryginalny URL
      isMine: true, // Wszystkie media w tej liście należą do zalogowanego użytkownika
    }));

    // Usuń pole password z danych użytkownika (dla bezpieczeństwa)
    const sanitizedMediaList = mediaListWithDetails.map((media) => ({
      ...media,
      uploadedBy: {
        ...media.uploadedBy,
        password: undefined, // Usuń hasło
      },
    }));

    // Zwróć listę mediów
    return NextResponse.json({ media: sanitizedMediaList });
  }
}
