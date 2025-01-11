import { SearchIcon } from "./svg/search-icon";
import { UserIcon } from "./svg/user-icon";
import { TagIcon } from "./svg/tag-icon";
import { DescriptionIcon } from "./svg/description-icon";
import { TitleIcon } from "./svg/title-icon";
import { AddImageIcon } from "./svg/add-image-icon";
import { UploadIcon } from "./svg/upload-icon";
import { CloseIcon } from "./svg/close-icon";
import { HeartIcon } from "./svg/heart-icon";
import { StarIcon } from "./svg/star-icons";
import { DownloadIcon } from "./svg/download-icon";

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
    case "tag":
      return <TagIcon width={width} height={height} color={color} />;
    case "description":
      return <DescriptionIcon width={width} height={height} color={color} />;
    case "title":
      return <TitleIcon width={width} height={height} color={color} />;
    case "add-image":
      return <AddImageIcon width={width} height={height} color={color} />;
    case "upload":
      return <UploadIcon width={width} height={height} color={color} />;
    case "close":
      return <CloseIcon width={width} height={height} color={color} />;
    case "heart":
      return <HeartIcon width={width} height={height} color={color} />;
    case "star":
      return <StarIcon width={width} height={height} color={color} />;
    case "download":
      return <DownloadIcon width={width} height={height} color={color} />;
    default:
      return <SearchIcon width={width} height={height} />;
  }
};
