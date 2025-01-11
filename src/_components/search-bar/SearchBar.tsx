"use client";
import { Input } from "@/_ui/input/Input";
import style from "./SearchBar.module.css";
export const SearchBar = ({ setValue }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };
  return (
    <div className={style.searchBar_container}>
      <Input
        type="text"
        placeholder="Search"
        onChange={handleChange}
        icon="search"
      />
    </div>
  );
};
