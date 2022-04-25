import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

type Props = {};

export default function MapImage({}: Props) {
  const { map_id } = useParams();
  return <div className="text-white text-lg">{map_id}</div>;
}
