import { AnimatePresence, motion } from "framer-motion";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer } from "react-leaflet";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import MapContextMenu from "../MapContextMenu";
import MapImage from "./MapImage";
export default function MapView() {
  const { project_id, map_id } = useParams();
  const queryClient = useQueryClient();
  const cm = useRef(null);
  const imgRef = useRef() as any;
  const [mapData, setMapData] = useState<{
    width: number;
    height: number;
    src: string;
    markers: Map["markers"];
  }>({
    width: 0,
    height: 0,
    src: "",
    markers: [],
  });
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([
    [0, 0],
    [0, 0],
  ]);
  const [newTokenDialog, setNewTokenDialog] = useState({
    title: "",
    document: "",
    lat: 0,
    lng: 0,
    show: false,
  });
  const maps: Map[] | undefined = queryClient.getQueryData(
    `${project_id}-maps`
  );
  useEffect(() => {
    // setMapData({ width: 0, height: 0, src: "", markers: [] });
    if (map_id) {
      const map = maps?.find((m) => m.id === map_id);
      if (map) {
        let img = new Image();
        img.src = map.map_image;
        img.onload = () => {
          setBounds([
            [0, 0],
            [img.height, img.width],
          ]);
          setMapData({
            width: img.width,
            height: img.height,
            src: map.map_image,
            markers: map.markers,
          });
        };
      }
    }
  }, [map_id]);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.setBounds([
        [0, 0],
        [mapData.height, mapData.width],
      ]);
    }
  }, [bounds]);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.on("context", (e: any) => {
        e.preventDefault();
        alert("AYYYY");
      });
    }
  }, [imgRef]);
  return (
    <div className="w-10 h-full">
      <MapContextMenu cm={cm} />
      <AnimatePresence exitBeforeEnter={true}>
        {mapData.width && mapData.height && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MapContainer
              className="w-full h-full bg-gray-900 relative"
              center={[mapData.width / 2, mapData.height / 2]}
              zoom={0}
              minZoom={-3}
              maxZoom={2}
              scrollWheelZoom={true}
              zoomSnap={0}
              crs={L.CRS.Simple}
              bounds={bounds}
            >
              <MapImage
                src={mapData.src}
                bounds={bounds}
                imgRef={imgRef}
                markers={mapData.markers}
                cm={cm}
              />
            </MapContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
