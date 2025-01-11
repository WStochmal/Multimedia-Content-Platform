"use client";
import React, { useEffect, forwardRef } from "react";
import style from "./GalleryImage.module.css";
import { Icon } from "@/_assets/icons/Icon";
import { useGallery } from "@/_hooks/useGallery";
import { useList } from "@/_hooks/useList";
import { useAuthContext } from "@/_hooks/useAuthContext";

interface GalleryImageProps {
  image: {
    createdAt: string;
    decription: string;
    id: number;
    title: string;
    tags: string[];
    url: string;
    aspectRatio: number;
    isFavourite: boolean;
    uploadedBy: {
      avatar: string;
      email: string;
      id: number;
      name: string;
    };
  };
  selectImage: (action: string, image: any) => void; // Funkcja do selekcji obrazka
  handleReversHeartIcon: (id: number, type: string) => void; // Funkcja dla ikony serca
  imageType: string;
}

// Dodajemy `forwardRef`, aby obsłużyć referencje
const GalleryImage = forwardRef<HTMLDivElement, GalleryImageProps>(
  ({ image, selectImage, handleReversHeartIcon, imageType }, ref) => {
    const { addToList, removeFromList } = useList();
    const { state } = useAuthContext();

    const displayTags = (tags: string[]) => {
      return tags.map((tag) => {
        return (
          <span key={tag} className={style.image_tag}>
            {tag}
          </span>
        );
      });
    };

    const handleImageClick = () => {
      selectImage("set", image);
    };

    const handleSetFavourite = async (e) => {
      console.log(image);
      e.preventDefault();
      e.stopPropagation();
      if (image.isFavourite) {
        if (await removeFromList("Favourites", image.id)) {
          handleReversHeartIcon(image.id, "remove");
        }
      } else {
        if (await addToList("Favourites", image.id)) {
          handleReversHeartIcon(image.id, "add");
        }
      }
    };

    return (
      <div
        ref={ref} // Używamy `ref` w głównym kontenerze
        className={style.gallery_item}
        style={{ "--aspect-ratio": image.aspectRatio }}
        onClick={handleImageClick}
      >
        <div className={style.gallery_image_container}>
          <img
            src={`media/thumbnail/${image.url}.webp`}
            alt={image.uploadedBy.name || image.uploadedBy.email}
            className={style.gallery_image}
          />
          {imageType !== "mine" && (
            <div className={style.gallery_overlay}>
              {state.user && (
                <div className={style.overlay_header}>
                  <button
                    onClick={handleSetFavourite}
                    className={style.heart_icon_btn}
                  >
                    <Icon
                      type="heart"
                      width={24}
                      height={24}
                      color={image.isFavourite ? "#d1004f" : "white"}
                    />
                  </button>
                </div>
              )}
              <div className={style.overlay_row_container}>
                <div className={style.overlay_row}>
                  <div className={style.avatar}>
                    <img
                      src={`./avatar/${image.uploadedBy.avatar}`}
                      alt="avatar"
                      loading="lazy"
                    />
                  </div>
                  <p>{image.uploadedBy.name || image.uploadedBy.email}</p>
                </div>
                <div className={style.overlay_row}>
                  <p className={style.image_title}>{image.title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Dodajemy nazwę wyświetlaną dla debugowania
GalleryImage.displayName = "GalleryImage";

export default GalleryImage;
