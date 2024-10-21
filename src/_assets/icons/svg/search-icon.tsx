import React from "react";
// !TODO move props into seperate file
interface SvgIconProps {
  width: number;
  height: number;
}

export const SearchIcon: React.FC<SvgIconProps> = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 513.749 513.749"
      width={width}
      height={height}
    >
      <g>
        <path d="M504.352,459.061l-99.435-99.477c74.402-99.427,54.115-240.344-45.312-314.746S119.261-9.277,44.859,90.15 S-9.256,330.494,90.171,404.896c79.868,59.766,189.565,59.766,269.434,0l99.477,99.477c12.501,12.501,32.769,12.501,45.269,0 c12.501-12.501,12.501-32.769,0-45.269L504.352,459.061z M225.717,385.696c-88.366,0-160-71.634-160-160s71.634-160,160-160 s160,71.634,160,160C385.623,314.022,314.044,385.602,225.717,385.696z" />
      </g>
    </svg>
  );
};
