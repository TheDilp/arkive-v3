import { AnimatePresence, motion } from "framer-motion";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useGetMapData } from "../../../utils/customHooks";
import MapContextMenu from "../MapContextMenu";
import MapImage from "./MapImage";
import CreateMarkerDialog from "./MapMarker/CreateMarkerDialog";
export default function MapView() {
  const { project_id, map_id } = useParams();
  const cm = useRef(null);
  const imgRef = useRef() as any;
  const mapData = useGetMapData(project_id as string, map_id as string);
  const [bounds, setBounds] = useState<number[][]>([
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
      if (mapData) {
        let img = new Image();
        img.src = mapData.map_image;
        img.onload = () => {
          setBounds([
            [0, 0],
            [img.height, img.width],
          ]);
          if (imgRef.current) {
            // Timeout to ensure transition happens during fade animation
            setTimeout(() => {
              imgRef.current.setBounds([
                [0, 0],
                [img.height, img.width],
              ]);
            }, 250);
          }
        };
      }
    }
  }, [map_id, mapData?.id]);

  return (
    <div className="w-10 h-full">
      <MapContextMenu
        cm={cm}
        lat={newTokenDialog.lat}
        lng={newTokenDialog.lng}
        setNewTokenDialog={setNewTokenDialog}
        bounds={bounds as number[][]}
      />
      <CreateMarkerDialog
        {...newTokenDialog}
        setVisible={() => setNewTokenDialog({ lat: 0, lng: 0, show: false })}
      />
      <AnimatePresence exitBeforeEnter={true}>
        {mapData && bounds && (
          <motion.div
            key={mapData.id}
            transition={{ duration: 0.25 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MapContainer
              className="w-full h-full bg-gray-900 relative"
              center={[bounds[1][0] / 2, bounds[1][1] / 2]}
              zoom={0}
              minZoom={-3}
              maxZoom={2}
              scrollWheelZoom={true}
              zoomSnap={0}
              crs={L.CRS.Simple}
              bounds={bounds as LatLngBoundsExpression}
            >
              <MapImage
                src={mapData.map_image}
                bounds={bounds as LatLngBoundsExpression}
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
