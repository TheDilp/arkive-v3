import { AnimatePresence, motion } from "framer-motion";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer } from "react-leaflet";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Map } from "../../../custom-types";
import { useGetMapData } from "../../../utils/customHooks";
import MapContextMenu from "../MapContextMenu";
import MapImage from "./MapImage";
import NewMarkerDialog from "./NewMarkerDialog";
export default function MapView() {
  const { project_id, map_id } = useParams();
  const queryClient = useQueryClient();
  const cm = useRef(null);
  const imgRef = useRef() as any;
  const mapData = useGetMapData(project_id as string, map_id as string);
  const [imgData, setImgData] = useState({ height: 0, width: 0, src: "" });
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([
    [0, 0],
    [0, 0],
  ]);
  const [newTokenDialog, setNewTokenDialog] = useState({
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
          setImgData({
            height: img.height,
            width: img.width,
            src: map.map_image,
          });
        };
      }
    }
  }, [map_id, maps]);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.setBounds([
        [0, 0],
        [imgData.height, imgData.width],
      ]);
    }
  }, [bounds]);

  return (
    <div className="w-10 h-full">
      <MapContextMenu cm={cm} setNewTokenDialog={setNewTokenDialog} />
      <NewMarkerDialog
        {...newTokenDialog}
        setVisible={() => setNewTokenDialog({ lat: 0, lng: 0, show: false })}
      />
      <AnimatePresence exitBeforeEnter={true}>
        {imgData.width && imgData.height && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MapContainer
              className="w-full h-full bg-gray-900 relative"
              center={[imgData.width / 2, imgData.height / 2]}
              zoom={0}
              minZoom={-3}
              maxZoom={2}
              scrollWheelZoom={true}
              zoomSnap={0}
              crs={L.CRS.Simple}
              bounds={bounds}
            >
              <MapImage
                src={imgData.src}
                bounds={bounds}
                imgRef={imgRef}
                markers={mapData.markers}
                setNewTokenDialog={setNewTokenDialog}
                cm={cm}
              />
            </MapContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
