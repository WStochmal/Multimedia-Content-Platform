import style from "./Gallery.module.css";
import GalleryImage from "./image/GalleryImage";

const images = [
  {
    author: "Wojciech Stochmal",
    uploaded: "2021-04-01T12:00:00Z",
    hashtag: ["#nature", "#mountains", "#forest"],
    url: "https://images.unsplash.com/photo-1719937206094-8de79c912f40?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-05-01T12:00:00Z",
    hashtag: ["#architecture", "#city"],
    url: "https://plus.unsplash.com/premium_photo-1729283814187-9b3d09e4ee32?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-06-10T12:00:00Z",
    hashtag: ["#landscape", "#outdoors"],
    url: "https://images.unsplash.com/photo-1729494130269-c5610ddbd300?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-07-15T12:00:00Z",
    hashtag: ["#sunset", "#sea", "#waves"],
    url: "https://images.unsplash.com/photo-1729432535925-99da7bd2e2be?q=80&w=1901&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-08-20T12:00:00Z",
    hashtag: ["#adventure", "#mountains"],
    url: "https://images.unsplash.com/photo-1729194292689-be924899456d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-09-01T12:00:00Z",
    hashtag: ["#forest", "#wildlife"],
    url: "https://images.unsplash.com/photo-1728876993086-2667f8dbe2f2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-10-01T12:00:00Z",
    hashtag: ["#premium", "#portrait"],
    url: "https://plus.unsplash.com/premium_photo-1728412895266-de6c477e0f9e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-11-10T12:00:00Z",
    hashtag: ["#cityscape", "#night"],
    url: "https://images.unsplash.com/photo-1729097587920-c7412fb244fb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-12-01T12:00:00Z",
    hashtag: ["#nature", "#desert"],
    url: "https://images.unsplash.com/photo-1729190932061-f589db40f31e?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // Add more images here
  {
    author: "Jan Kowalski",
    uploaded: "2021-12-01T12:00:00Z",
    hashtag: ["#nature", "#desert"],
    url: "https://plus.unsplash.com/premium_photo-1712029092542-4223e7e91ea4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-12-01T12:00:00Z",
    hashtag: ["#nature", "#desert"],
    url: "https://images.unsplash.com/photo-1729599923222-127191facb83?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-12-01T12:00:00Z",
    hashtag: ["#nature", "#desert"],
    url: "https://images.unsplash.com/photo-1729512942141-4ddc5bf09dc2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-12-01T12:00:00Z",
    hashtag: ["#nature", "#desert"],
    url: "https://images.unsplash.com/photo-1714921861690-fa78d81eb2c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Jan Kowalski",
    uploaded: "2021-12-01T12:00:00Z",
    hashtag: ["#nature", "#desert"],
    url: "https://images.unsplash.com/photo-1699791911069-2ee9937e97ee?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Gallery: React.FC = () => {
  const column1 = images.filter((_, index) => index % 3 === 0);
  const column2 = images.filter((_, index) => index % 3 === 1);
  const column3 = images.filter((_, index) => index % 3 === 2);

  return (
    <div className={style.gallery_container}>
      <div className={style.gallery_column}>
        {column1.map((src, index) => (
          <GalleryImage image={src} key={index} />
        ))}
      </div>
      <div className={style.gallery_column}>
        {column2.map((src, index) => (
          <GalleryImage image={src} key={index} />
        ))}
      </div>
      <div className={style.gallery_column}>
        {column3.map((src, index) => (
          <GalleryImage image={src} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
