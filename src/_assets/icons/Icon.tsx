import { SearchIcon } from "./svg/search-icon";
import { UserIcon } from "./svg/user-icon";

// !TODO move props into seperate file
interface IconProps {
  type: string;
  width: number;
  height: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ type, width, height, color }) => {
  switch (type) {
    case "search":
      return <SearchIcon width={width} height={height} color={color} />;
    case "user":
      return <UserIcon width={width} height={height} />;
    default:
      return <SearchIcon width={width} height={height} />;
  }
};
