import React from "react";
import style from "./GalleryImage.module.css";
import { Icon } from "@/_assets/icons/Icon";
// !TODO move props into seperate file
interface GalleryImageProps {
  author: string;
  uploaded: string;
  hashtag: string[];
  url: string;
}

const GalleryImage = ({ image }: { image: GalleryImageProps }) => {
  const displayTags = (tags: string[]) => {
    return tags.map((tag) => {
      return (
        <span key={tag} className={style.image_tag}>
          {tag}
        </span>
      );
    });
  };
  return (
    <div className={style.gallery_item}>
      <div className={style.gallery_image_container}>
        <img
          src={image.url}
          alt={image.author}
          className={style.gallery_image}
        />
        <div className={style.gallery_overlay}>
          <div className={style.overlay_row}>
            {" "}
            <div className={style.avatar}>
              <Icon type="user" width={18} height={18} />
            </div>
            <p>{image.author}</p>
          </div>
          <div className={style.overlay_row}>
            <p>{image.uploaded}</p>
          </div>
        </div>
        {/* // !TODO fix tags so they wouldn't make additional space beetwen images */}
        {/* <div className={style.image_tags}>{displayTags(image.hashtag)}</div> */}
      </div>
    </div>
  );
};

export default GalleryImage;
