"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import style from "./Gallery.module.css";
import GalleryImage from "./image/GalleryImage";
import { useGallery } from "@/_hooks/useGallery";
import SelectedImage from "./selected-image/SelectedImage";
import { useAuthContext } from "@/_hooks/useAuthContext";
import { useRouter } from "next/navigation";

const Gallery: React.FC = ({ type = "default", searchValue }) => {
  const { fetchGallery, isLoading, error } = useGallery();
  const [activeMedia, setActiveMedia] = useState(null);
  const [isReseting, setIsReseting] = useState(false);
  const [galleryType, setGalleryType] = useState({
    state: "uninitialized",
    type: "default",
  });
  const { state } = useAuthContext();

  const router = useRouter();

  const [columns, setColumns] = useState({
    column1: [],
    column2: [],
    column3: [],
  });

  const [page, setPage] = useState(1); // Paginacja
  const hasMore = useRef(true); // Czy są jeszcze elementy do załadowania

  const observer = useRef<IntersectionObserver | null>(null); // Referencja dla infinite scrolling

  useEffect(() => {
    if (type === "default") {
      console.log("Zmiana typu galerii");
      if (window.location.hash === "#recommended") {
        setGalleryType({ state: "initialized", type: "recommended" });
        setColumns({ column1: [], column2: [], column3: [] });
        setPage(1);
        hasMore.current = true;
      } else {
        setGalleryType({ state: "initialized", type: "default" });
        setColumns({ column1: [], column2: [], column3: [] });
        setPage(1);
        hasMore.current = true;
      }
    } else {
      setGalleryType({ state: "initialized", type: "default" });
      setColumns({ column1: [], column2: [], column3: [] });
      setPage(1);
      hasMore.current = true;
    }
  }, []);

  const handleChangeGalleryType = (type) => {
    setGalleryType({ state: "initialized", type });
    setColumns({ column1: [], column2: [], column3: [] });
    setPage(1);
    hasMore.current = true;
  };
  // Reset przy zmianie searchValue
  useEffect(() => {
    console.log("Resetowanie galerii");
    setColumns({
      column1: [],
      column2: [],
      column3: [],
    }); // Reset kolumn
    setPage(1); // Reset paginacji
    hasMore.current = true; // Przywrócenie możliwości ładowania
    setIsReseting(!isReseting); // Resetuje komponenty
  }, [searchValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (state.isInitialized && hasMore.current) {
        const data =
          galleryType.type === "recommended"
            ? await fetchGallery({
                type: "recommended",
                page,
                imageType: type,
                searchValue: searchValue,
              })
            : await fetchGallery({
                type: "default",
                page,
                imageType: type,
                searchValue: searchValue,
              });

        console.log("Załadowane dane:", data);

        if (!data || data.media.length === 0) {
          hasMore.current = false;
          return;
        }

        // Rozdziel dane na kolumny
        const sortedColumns = { ...columns };
        const columnHeights = {
          column1: sortedColumns.column1.reduce(
            (sum, item) => sum + 1 / item.aspectRatio,
            0
          ),
          column2: sortedColumns.column2.reduce(
            (sum, item) => sum + 1 / item.aspectRatio,
            0
          ),
          column3: sortedColumns.column3.reduce(
            (sum, item) => sum + 1 / item.aspectRatio,
            0
          ),
        };

        data.media.forEach((item) => {
          const targetColumn = Object.keys(columnHeights).reduce(
            (minCol, col) =>
              columnHeights[col] < columnHeights[minCol] ? col : minCol
          );

          sortedColumns[targetColumn].push(item);
          columnHeights[targetColumn] += 1 / item.aspectRatio;
        });

        setColumns(sortedColumns);
      }
    };

    if (galleryType.state === "initialized") fetchData();
  }, [state.isInitialized, galleryType, page, isReseting]); // Dodano searchValue do zależności

  const handleReversHeartIcon = (id: number, type: string) => {
    const updateColumn = (column: typeof columns.column1) => {
      return column.map((item) =>
        item.id === id ? { ...item, isFavourite: type === "add" } : item
      );
    };

    setColumns({
      ...columns,
      column1: updateColumn(columns.column1),
      column2: updateColumn(columns.column2),
      column3: updateColumn(columns.column3),
    });
  };

  const handleActiveMedia = (action, item) => {
    switch (action) {
      case "set":
        setActiveMedia(item);
        break;
      case "clear":
        setActiveMedia(null);
        break;
      default:
        break;
    }
  };

  // Infinite scrolling observer
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore.current) {
          console.log("Ładowanie kolejnej strony");
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  const renderTitle = () => {
    if (type === "default") {
      return (
        <div className={style.gallery_title}>
          <h1>{galleryType.type} gallery</h1>
          <div className={style.gallery_type}>
            <button
              className={
                galleryType.type === "default"
                  ? style.commonBtn2
                  : style.inactive2
              }
              onClick={() => {
                router.push("/");
                handleChangeGalleryType("default");
              }}
            >
              Default
            </button>
            {state?.user ? (
              <button
                className={
                  galleryType.type === "recommended"
                    ? style.commonBtn2
                    : style.inactive2
                }
                onClick={() => {
                  router.push("/#recommended");
                  handleChangeGalleryType("recommended");
                }}
              >
                Recommended
              </button>
            ) : null}
          </div>
        </div>
      );
    } else if (type === "favourite") {
      return (
        <div className={style.gallery_title}>
          <h1>Favourite gallery</h1>
        </div>
      );
    } else if (type === "mine") {
      return (
        <div className={style.gallery_title}>
          <h1>My gallery</h1>
        </div>
      );
    }
  };

  return (
    <>
      {activeMedia && (
        <SelectedImage
          image={activeMedia}
          closeSelectedImage={() => handleActiveMedia("clear", null)}
        />
      )}
      <div className="content">
        <div className={style.gallery_header}>{renderTitle()}</div>
        <div className={style.gallery_container}>
          {["column1", "column2", "column3"].map((column, columnIndex) => (
            <div key={columnIndex} className={style.gallery_column}>
              {columns[column].map((src, index) => {
                const isLastElement =
                  columnIndex === 2 && index === columns[column].length - 1;

                return (
                  <GalleryImage
                    ref={isLastElement ? lastElementRef : null}
                    image={src}
                    key={`${src.id}-${index}`}
                    selectImage={handleActiveMedia}
                    handleReversHeartIcon={handleReversHeartIcon}
                    imageType={type}
                  />
                );
              })}
            </div>
          ))}
        </div>
        {!hasMore.current && !isLoading && (
          <div className={style.no_more_images}>
            <p>No more images</p>
          </div>
        )}

        {isLoading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default Gallery;
