import { AnimatePresence, motion } from "framer-motion";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer } from "react-leaflet";
import { useQuery } from "react-query";
import { Navigate, To, useParams } from "react-router-dom";
import { auth, getSingleMap } from "../../../utils/supabaseUtils";
import { supabaseStorageImagesLink, toastWarn } from "../../../utils/utils";

import PublicMapImage from "./PublicMapImage";

export default function PublicMapView() {
  const { map_id } = useParams();
  const user = auth.user();
  const { data: mapData, isLoading } = useQuery(
    map_id as string,
    async () => await getSingleMap(map_id as string)
  );
  const cm = useRef(null);
  const imgRef = useRef() as any;
  const mapRef = useRef() as any;
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  useEffect(() => {
    if (mapData && mapData.map_image?.link) {
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
      };
    }
  }, [mapData?.id, mapData?.map_image]);

  useEffect(() => {
    //  Wait for map to finish loading
    setTimeout(() => {
      if (mapRef.current) mapRef.current?.flyToBounds(bounds);
    }, 350);
  }, [map_id, bounds, mapRef.current]);

  if (isLoading)
    return (
      <div className="w-full h-full flex align-items-center justify-content-center">
        <h1 className="text-white Merriweather align-self-start">
          Loading Map...
        </h1>
      </div>
    );
  if (!mapData || (!mapData.public && !user)) {
    toastWarn("This page is not public.");
    return <Navigate to={-1 as To} />;
  }
  return (
    <div className="w-full h-full">
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
                <PublicMapImage
                  src={`${supabaseStorageImagesLink}${mapData.map_image.link}`}
                  bounds={bounds as LatLngBoundsExpression}
                  imgRef={imgRef}
                  markers={mapData.markers}
                  cm={cm}
                />
              )}
            </MapContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
