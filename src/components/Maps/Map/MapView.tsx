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
  const [imgData, setImgData] = useState<
    (Map & { height: number; width: number; src: string }) | null
  >(null);
  const [bounds, setBounds] = useState<LatLngBoundsExpression>([
    [0, 0],
    [0, 0],
  ]);
  const [newTokenDialog, setNewTokenDialog] = useState({
    lat: 0,
    lng: 0,
    show: false,
  });

  useEffect(() => {
    if (map_id) {
      setImgData(null);
      setTimeout(() => {
        if (mapData) {
          let img = new Image();
          img.src = mapData.map_image;
          img.onload = () => {
            setBounds([
              [0, 0],
              [img.height, img.width],
            ]);
            setImgData({
              ...mapData,
              height: img.height,
              width: img.width,
              src: mapData.map_image,
            });
          };
        }
      }, 750);
    }
  }, [map_id, mapData]);

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
        {imgData && imgData.width && imgData.height && (
          <motion.div
            transition={{ duration: 0.5 }}
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
                markers={imgData.markers}
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
