import Gallery from "@/_components/gallery/Gallery";
import { Header } from "@/_components/header/Header";
import { SearchBar } from "@/_components/search-bar/SearchBar";

export default function Home() {
  return (
    <div>
      <Header />
      <SearchBar />
      <h1>Home</h1>
      <p>For you</p>
      {/*  // !TODO: fix a gallery component to properly manage images into column */}
      <Gallery />
    </div>
  );
}
