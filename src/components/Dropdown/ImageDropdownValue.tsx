import React from "react";

type Props = {
  image?: string;
};

export default function ImageDropdownValue({ image }: Props) {
  return <div>{image || "Select Map"}</div>;
}
