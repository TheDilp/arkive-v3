import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Projection } from "ol/proj";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map as MapType } from "../../custom-types";
import { Icon, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import { Vector as VectorLayer } from "ol/layer";
import { motion, AnimatePresence } from "framer-motion";
import MapContextMenu from "./MapContextMenu";
export default function MapView() {
  const { project_id, map_id } = useParams();
  const queryClient = useQueryClient();
  const cm = useRef(null);
  const mapRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [imageData, setImageData] = useState({ width: 0, height: 0, src: "" });
  const [test, setTest] = useState(true);
  const maps: MapType[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  useEffect(() => {
    setTest(false);
    if (maps) {
      const map = maps.find((m) => m.id === map_id);
      if (map) {
        setTimeout(() => {
          setTest(true);
          let img = new Image();
          img.src = map.map_image;
          img.onload = () =>
            setImageData({
              width: img.width,
              height: img.height,
              src: img.src,
            });
          setImageData({ width: img.width, height: img.height, src: img.src });
        }, 750);
      }
    }
  }, [map_id]);

  useEffect(() => {
    if (imageData.width && imageData.height) {
      const extent = [0, 0, imageData.width, imageData.height];
      const projection = new Projection({
        code: "whatevz",
        units: "m",
        extent: extent,
        worldExtent: extent,
      });
      const iconFeature = new Feature({
        geometry: new Point([0, 0]),
        name: "Null Island",
        population: 4000,
        rainfall: 500,
      });

      const iconStyle = new Style({
        image: new Icon({
          src: "https://api.iconify.design/mdi/wizard-hat.svg?color=white",
          anchor: [0, 0],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
        }),
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      let mapp = new Map({
        target: mapRef.current || "map",
        layers: [
          new ImageLayer({
            source: new Static({
              url: imageData.src,
              imageExtent: extent,
            }),
          }),
          vectorLayer,
        ],

        view: new View({
          resolution: 1,
          center: [imageData.width / 2, imageData.height / 2],
          projection,
          maxZoom: 5,
          multiWorld: false,
        }),
      });

      return () => mapp.dispose();
    }
  }, [imageData]);
  return (
    <div className="w-10 h-screen">
      <MapContextMenu cm={cm} />
      <AnimatePresence exitBeforeEnter>
        {test && imageData.src && (
          <motion.div
            onContextMenu={(e) => {
              e.preventDefault();
              //@ts-ignore
              cm.current.show(e);
            }}
            id="map"
            key={map_id}
            ref={mapRef}
            className="w-full h-full"
            transition={{ ease: "easeInOut", duration: 0.5 }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
