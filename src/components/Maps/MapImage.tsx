import React, { useEffect } from "react";
import { ImageOverlay, useMapEvents } from "react-leaflet";

type Props = {};

export default function MapImage({}: Props) {
  const map = useMapEvents({});

  useEffect(() => {
    map.fitWorld({ maxZoom: -2 });
  }, []);
  return (
    <ImageOverlay
      bounds={[
        [-1000, -1000],
        [1000, 1000],
      ]}
      url={"https://i.imgur.com/a2tnaPp_d.webp?maxwidth=760&fidelity=grand"}
      //   ref={imgRef}
    />
  );
}
