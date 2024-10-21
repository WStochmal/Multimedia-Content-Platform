import React from "react";
// !TODO move props into seperate file
interface SvgIconProps {
  width: number;
  height: number;
}

export const UserIcon: React.FC<SvgIconProps> = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 513.749 513.749"
      width={width}
      height={height}
    >
      <g>
        <circle cx="256" cy="128" r="128" />
        <path d="M256,298.667c-105.99,0.118-191.882,86.01-192,192C64,502.449,73.551,512,85.333,512h341.333   c11.782,0,21.333-9.551,21.333-21.333C447.882,384.677,361.99,298.784,256,298.667z" />
      </g>
    </svg>
  );
};
