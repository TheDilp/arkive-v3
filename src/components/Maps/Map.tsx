import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import { Projection } from "ol/proj";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { useLayoutEffect, useMemo, useRef } from "react";
type Props = {};
export default function MapView({}: Props) {
  const mapRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  let img = useMemo(() => new Image(), []);
  img.src = "https://i.imgur.com/vKRh6Nu.png";
  useLayoutEffect(() => {
    if (img.width && img.height && mapRef.current) {
      const extent = [0, 0, img.width, img.height];
      const projection = new Projection({
        code: "whatevz",
        units: "m",
        extent: extent,
        worldExtent: extent,
      });

      let mapp = new Map({
        target: mapRef.current || "map",
        layers: [
          new ImageLayer({
            source: new Static({
              url: img.src,
              imageExtent: extent,
            }),
          }),
        ],

        view: new View({
          resolution: 1,
          center: [img.width / 2, img.height / 2],
          projection,
          maxZoom: 5,
          multiWorld: false,
        }),
      });

      return () => mapp.dispose();
    }
  }, [img]);

  return <div id="map" ref={mapRef} className="w-10 h-screen"></div>;
}
