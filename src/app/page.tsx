"use client";
import Gallery from "@/_components/gallery/Gallery";
import { SearchBar } from "@/_components/search-bar/SearchBar";
import { useState } from "react";

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div>
      <SearchBar setValue={setSearchValue} />
      <Gallery type="default" searchValue={searchValue} />
    </div>
  );
}
