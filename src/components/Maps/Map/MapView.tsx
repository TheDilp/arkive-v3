import { AnimatePresence, motion } from "framer-motion";
import L, { LatLngBoundsExpression } from "leaflet";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapContainer } from "react-leaflet";
import { useParams } from "react-router-dom";
import { MapMarkerProps } from "../../../types/MapTypes";
import { useGetMapData } from "../../../utils/customHooks";
import { supabaseStorageImagesLink } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import MapContextMenu from "../MapContextMenu";
import MapImage from "./MapImage";
import CreateMarkerDialog from "./MapMarker/CreateMarkerDialog";
export default function MapView({
  public_view,
  setMapId,
}: {
  public_view: boolean;
  setMapId?: Dispatch<SetStateAction<string>>;
}) {
  const { project_id, map_id, marker_id } = useParams();

  const cm = useRef(null);
  const imgRef = useRef() as any;
  const mapRef = useRef() as any;
  const mapData = useGetMapData(
    project_id as string,
    map_id as string,
    public_view
  );
  const { isTabletOrMobile } = useContext(MediaQueryContext);
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const [newTokenDialog, setNewTokenDialog] = useState({
    lat: 0,
    lng: 0,
    show: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mapData && mapData.map_image?.link) {
      setLoading(true);
      let img = new Image();
      img.src = `${supabaseStorageImagesLink}${mapData.map_image.link}`;
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
        setLoading(false);
      };
    }
  }, [mapData?.id, mapData?.map_image]);

  useEffect(() => {
    if (map_id && !public_view && setMapId) setMapId(map_id);
    //  Wait for map to finish loading
    setTimeout(() => {
      if (marker_id) {
        let marker = mapData?.markers.find(
          (marker: MapMarkerProps) => marker.id === marker_id
        );
        if (marker) {
          mapRef.current.flyTo([marker.lat, marker.lng]);
        } else {
          mapRef.current.flyToBounds(bounds);
        }
      } else {
        mapRef.current?.flyToBounds(bounds);
      }
    }, 350);

    return () => {
      if (setMapId) setMapId("");
    };
  }, [map_id, bounds]);

  if (loading)
    return (
      <div
        className={`${
          public_view ? "w-full" : "w-10"
        } h-full flex align-items-center justify-content-center`}
      >
        <h1 className="text-white Merriweather align-self-start">
          Loading Map...
        </h1>
      </div>
    );
  return (
    <div
      className={`${
        isTabletOrMobile || public_view ? "w-full" : "w-10"
      }   h-full`}
    >
      {!public_view && (
        <>
          <MapContextMenu
            cm={cm}
            mapRef={mapRef}
            lat={newTokenDialog.lat}
            lng={newTokenDialog.lng}
            setNewTokenDialog={setNewTokenDialog}
            bounds={bounds as number[][]}
          />
          <CreateMarkerDialog
            {...newTokenDialog}
            setVisible={setNewTokenDialog}
          />
        </>
      )}
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
              ref={mapRef}
              className="w-full h-full bg-gray-900 relative outline-none"
              center={[bounds[1][0] / 2, bounds[1][1] / 2]}
              zoom={0}
              minZoom={-3}
              maxZoom={2}
              scrollWheelZoom={true}
              zoomSnap={0}
              crs={L.CRS.Simple}
              bounds={bounds as LatLngBoundsExpression}
              attributionControl={false}
            >
              {mapData.map_image?.link && (
                <MapImage
                  src={`${supabaseStorageImagesLink}${mapData.map_image.link}`}
                  bounds={bounds as LatLngBoundsExpression}
                  imgRef={imgRef}
                  markers={mapData.markers}
                  map_layers={mapData.map_layers}
                  setNewTokenDialog={setNewTokenDialog}
                  cm={cm}
                  public_view={public_view}
                />
              )}
            </MapContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
