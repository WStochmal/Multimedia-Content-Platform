import style from "./Gallery.module.css";

const images = [
  "https://images.unsplash.com/photo-1719937206094-8de79c912f40?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1729283814187-9b3d09e4ee32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729494130269-c5610ddbd300?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729432535925-99da7bd2e2be?q=80&w=1901&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729194292689-be924899456d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1728876993086-2667f8dbe2f2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1728412895266-de6c477e0f9e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729097587920-c7412fb244fb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1729190932061-f589db40f31e?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const Gallery: React.FC = () => {
  const column1 = images.filter((_, index) => index % 3 === 0);
  const column2 = images.filter((_, index) => index % 3 === 1);
  const column3 = images.filter((_, index) => index % 3 === 2);

  return (
    <div className={style.gallery_container}>
      <div className={style.gallery_column}>
        {column1.map((src, index) => (
          <img
            className={style.gallery_image}
            src={src}
            alt={`Gallery image ${index}`}
            key={index}
          />
        ))}
      </div>
      <div className={style.gallery_column}>
        {column2.map((src, index) => (
          <img
            className={style.gallery_image}
            src={src}
            alt={`Gallery image ${index}`}
            key={index}
          />
        ))}
      </div>
      <div className={style.gallery_column}>
        {column3.map((src, index) => (
          <img
            className={style.gallery_image}
            src={src}
            alt={`Gallery image ${index}`}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
