import React from "react";

type Props = {
  map_image?: string;
};

export default function ImageDropdownValue({ map_image }: Props) {
  return <div>{map_image || "Select Map"}</div>;
}
