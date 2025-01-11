import React from "react";
import style from "./SelectedImage.module.css";
import { Icon } from "@/_assets/icons/Icon";
const SelectedImage = ({ image, closeSelectedImage }) => {
  console.log("Selected image:", image);
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeSelectedImage();
  };

  const formatDate = (d) => {
    const date = new Date(d); // Tworzymy obiekt Date z ISO stringa

    // Formatujemy datę w formacie YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `media/orginal/${image.orginalUrl}`;
    link.download = image.title;
    link.click();
  };

  if (!image) return null;
  return (
    <div className={style.selectedImageContainerBg} onClick={handleClose}>
      <div
        className={style.selectedImageContainer}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={style.selectedImageHeader}>
          <span className={style.spanBlock}>
            <span className={style.spanBlockHeader}>
              <h2>{image?.title}</h2>
              <div>
                <button className="commonBtn" onClick={handleDownload}>
                  <Icon type="download" width={18} height={18} color="white" />
                </button>
                <button className="commonBtn" onClick={handleClose}>
                  <Icon type="close" width={18} height={18} color="white" />
                  Close
                </button>
              </div>
            </span>
            <span className={style.spanBlockHeaderFooter}>
              <span>
                <span className={style.avatar}>
                  <img
                    src={`./avatar/${image.uploadedBy.avatar}`}
                    alt="avatar"
                    loading="lazy"
                  />
                </span>

                <p>{image.uploadedBy.name || image.uploadedBy.email}</p>
              </span>

              <span>{formatDate(image.createdAt)}</span>
            </span>
          </span>
          <span className={style.spanBlock}>
            <div className={style.description}>{image?.description}</div>
            <div className={style.tags}>
              {image?.tags.map((tag, tagIdx) => {
                return <span key={tagIdx}>{tag}</span>;
              })}
            </div>
          </span>
        </div>
        <div className={style.selectedImagePreview}>
          <img
            className={style.image}
            src={`media/orginal/${image.orginalUrl}`}
            alt={image.title}
          />
          <img
            className={style.imageBgFilter}
            src={`media/orginal/${image.orginalUrl}`}
            alt={image.title}
          />
        </div>
        {/* SelectedImage : {image.title}
        <Icon type="close" width={24} height={24} color="black" /> */}
      </div>
    </div>
  );
};

export default SelectedImage;
