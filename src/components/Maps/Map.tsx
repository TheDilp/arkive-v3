import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import { Projection } from "ol/proj";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
type Props = {};
export default function MapView({}: Props) {
  const [mapData, setMapData] = useState();

  const mapRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  let img = useMemo(() => new Image(), []);
  img.src = "https://i.imgur.com/arruiGW.jpeg";
  useLayoutEffect(() => {
    console.log(img.width, img.height);
    if (img.width && img.height) {
      const extent = [0, 0, img.width, img.height];
      const projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });
      let mapp = new Map({
        target: "map",
        layers: [
          new ImageLayer({
            source: new Static({
              url: img.src,
              imageExtent: extent,
              projection: projection,
            }),
          }),
        ],
        view: new View({
          center: [img.width / 2, img.height / 2],
          projection: projection,
          zoom: 2,
        }),
      });
      return () => mapp.dispose();
    }
  }, [img]);

  return <div id="map" ref={mapRef} className="w-screen h-screen"></div>;
}
