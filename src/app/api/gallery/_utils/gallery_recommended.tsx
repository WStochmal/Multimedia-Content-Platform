export async function recommendedMediaList(
  tokenPayload,
  limit,
  page,
  offset,
  searchValue,
  prisma,
  NextResponse
) {
  console.log("Fetching recommended media");

  if (!tokenPayload.payload?.id) {
    return NextResponse.json(
      { message: "User must be logged in for recommendations" },
      { status: 401 }
    );
  }
  const userId = tokenPayload.payload.id;

  // List of favourite media
  const favouriteMediaList = await getFavouriteMediaList(prisma, userId);

  // List of most used user tags

  const mostUsedUserTags = await getMostUsedUserTags(prisma, userId);

  // Get recommended media
  const rankedMediaList = await getRankedMediaList(
    prisma,
    favouriteMediaList,
    mostUsedUserTags,
    limit,
    page,
    offset,
    searchValue,
    userId
  );
  return NextResponse.json({ media: rankedMediaList });
}

const getFavouriteMediaList = async (prisma, userId) => {
  // Pobierz listę mediów ulubionych użytkownika
  const favouriteMediaList = await prisma.mediaList.findFirst({
    where: { userId: userId, name: "Favourites" },
    select: { mediaIds: true }, // Pobieramy tylko mediaIds
  });

  // console.log("Favourite media list ids?:", favouriteMediaList);

  if (
    !favouriteMediaList ||
    !favouriteMediaList.mediaIds ||
    favouriteMediaList.mediaIds.length === 0
  ) {
    console.log("No favourite media found");
    return [];
  }

  // Pobierz tagi dla wszystkich ulubionych mediów
  const favouriteMediaTags = await prisma.media.findMany({
    where: { id: { in: favouriteMediaList.mediaIds } },
    select: { tags: true },
  });

  const allFavouriteMediaTags = favouriteMediaTags.flatMap(
    (media) => media.tags
  );

  // console.log("All favourite media tags:", allFavouriteMediaTags);

  // Zlicz wystąpienia tagów
  const tagCount = {};

  favouriteMediaTags.forEach((media) => {
    media.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  // Posortuj tagi po liczbie wystąpień
  const sortedFavouriteMediaTags = Object.entries(tagCount).sort(
    (a, b) => b[1] - a[1]
  );

  console.log("Sorted favourite media tags:", sortedFavouriteMediaTags);

  return {
    allFavouriteMediaTags,
    sortedFavouriteMediaTags,
    favouriteMediaList,
  };
};

const getMostUsedUserTags = async (prisma, userId) => {
  const tagList = await prisma.media.findMany({
    where: { uploadedById: userId },
    select: { tags: true },
  });

  console.log("Uploaded media tag list:", tagList);

  const tagListCount = {};

  tagList.forEach((media) => {
    media.tags.forEach((tag) => {
      tagListCount[tag] = (tagListCount[tag] || 0) + 1;
    });
  });

  const allTags = tagList.flatMap((media) => media.tags);

  const sortedTagListCount = Object.entries(tagListCount).sort(
    (a, b) => b[1] - a[1]
  );
  console.log("Uploaded media tag list count:", sortedTagListCount);

  return { allTags, sortedTagListCount };
};

const getRankedMediaList = async (
  prisma,
  favouriteMediaList,
  mostUsedUserTags,
  limit,
  page,
  offset,
  searchValue,
  userId
) => {
  // Połączenie tagów z ulubionych mediów i najczęściej używanych tagów
  const allTags = Array.from(
    new Set([
      ...(favouriteMediaList.allFavouriteMediaTags || []),
      ...(mostUsedUserTags.allTags || []),
    ])
  );

  // Utworzenie rankingu tagów
  const tagsRankingList = getTagsRankingList(
    mostUsedUserTags.sortedTagListCount,
    favouriteMediaList.sortedFavouriteMediaTags
  );

  // Pobranie 150 najnowszych zdjęć na podstawie ulubionych tagów
  const mediaBatchSize = 150;
  const batchOffset =
    Math.floor((page * limit) / mediaBatchSize) * mediaBatchSize;
  const batchMedia = await prisma.media.findMany({
    take: mediaBatchSize,
    skip: batchOffset,
    where: {
      OR: [
        {
          tags: { hasSome: allTags }, // Zdjęcia zawierające dowolny z ulubionych tagów
        },
      ],
      NOT: [
        { uploadedById: userId }, // Wykluczenie zdjęć przesłanych przez użytkownika
        { id: { in: favouriteMediaList.favouriteMediaList.mediaIds } }, // Wykluczenie ulubionych zdjęć
      ],
    },
    select: {
      id: true,
      url: true,
      tags: true,
      createdAt: true,
      title: true,
      aspectRatio: true,
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Sortowanie według najnowszych
    },
  });

  // Przeliczenie rankingu dla mediów
  const rankedMedia = batchMedia
    .map((media) => {
      const mediaRank = media.tags.reduce((sum, tag) => {
        const tagRank =
          tagsRankingList.find((item) => item.tag === tag)?.weight || 0;
        return sum + tagRank;
      }, 0);
      return { ...media, rank: mediaRank };
    })
    .sort((a, b) => b.rank - a.rank); // Sortowanie po rankingu

  // Paginacja w obrębie posortowanych wyników
  const paginatedMedia = rankedMedia.slice(
    offset % mediaBatchSize,
    (offset % mediaBatchSize) + limit
  );

  // Usuwanie niepotrzebnych danych oraz przygotowanie wyników
  const sanitizedMediaList = paginatedMedia.map((media) => ({
    ...media,
    url: media.url.replace(/\.[^/.]+$/, ""), // Usuń rozszerzenie z URL
    originalUrl: media.url,
    isFavourite: Array.isArray(favouriteMediaList?.favouriteMediaList?.mediaIds)
      ? favouriteMediaList.favouriteMediaList.mediaIds.includes(media.id)
      : false,
    rank: media.rank, // Dodanie wyliczonego rankingu
    uploadedBy: {
      ...media.uploadedBy,
      password: undefined, // Usuń pole password
    },
  }));

  return sanitizedMediaList;
};

const getTagsRankingList = (sortedTagListCount, sortedFavouriteMediaTags) => {
  const favouriteTagWeight = 0.6;
  const userTagWeight = 0.4;

  const tagMap = new Map();

  for (const [tag, count] of sortedTagListCount) {
    const weight = count * userTagWeight;
    tagMap.set(tag, (tagMap.get(tag) || 0) + weight);
  }

  for (const [tag, count] of sortedFavouriteMediaTags) {
    const weight = count * favouriteTagWeight;
    tagMap.set(tag, (tagMap.get(tag) || 0) + weight);
  }

  const tagsRankingList = Array.from(tagMap.entries())
    .map(([tag, weight]) => ({ tag, weight }))
    .sort((a, b) => b.weight - a.weight);

  console.log("Tags ranking list:", tagsRankingList);

  return tagsRankingList;
};
