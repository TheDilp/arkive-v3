import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import { Projection } from "ol/proj";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map as MapType } from "../../custom-types";
import LoadingScreen from "../Util/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
export default function MapView() {
  const { project_id, map_id } = useParams();
  const queryClient = useQueryClient();
  const mapRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [imageData, setImageData] = useState({ width: 0, height: 0, src: "" });
  const [test, setTest] = useState(true);
  const maps: MapType[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  useEffect(() => {
    if (map_id) {
      const map = maps?.find((m) => m.id === map_id);
      if (map) {
        setTimeout(() => {
          let img = new Image();
          img.src = map.map_image;
          img.onload = () =>
            setImageData({
              width: img.width,
              height: img.height,
              src: img.src,
            });
          setImageData({ width: img.width, height: img.height, src: img.src });
          setTest(true);
        }, 750);
      }
    }

    // return () => clearTimeout(timeout);
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

      let mapp = new Map({
        target: mapRef.current || "map",
        layers: [
          new ImageLayer({
            source: new Static({
              url: imageData.src,
              imageExtent: extent,
            }),
          }),
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
  }, [bounds]);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.on("contextmenu", (e) => {});
    }
  }, [imgRef]);
  return (
    <div className="w-10 h-screen">
      <AnimatePresence exitBeforeEnter>
        {test && imageData.src && (
          <motion.div
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
