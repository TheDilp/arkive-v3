import { LatLngBoundsExpression, CRS } from "leaflet";
import { useEffect, useRef, useState } from "react";

import { ImageOverlay, MapContainer } from "react-leaflet";

type Props = {
  readOnly?: boolean;
};

export default function MapView({ readOnly }: Props) {
  const mapRef = useRef() as any;
  const imgRef = useRef() as any;

  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src =
      "https://images.unsplash.com/photo-1668714298641-a221ceb27d0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
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
  }, []);
  useEffect(() => {
    //  Wait for map to finish loading
    setTimeout(() => {
      mapRef.current?.flyToBounds(bounds);
    }, 350);
  }, [bounds]);
  return (
    <div className="w-full flex flex-col flex-1 ">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
        integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
        crossOrigin=""
      />
      <MapContainer
        ref={mapRef}
        className="w-full h-full flex-1 outline-none bg-zinc-900"
        center={[bounds[1][0] / 2, bounds[1][1] / 2]}
        zoom={0}
        minZoom={-3}
        maxZoom={2}
        scrollWheelZoom={true}
        zoomSnap={0}
        crs={CRS.Simple}
        bounds={bounds as LatLngBoundsExpression}
        attributionControl={false}>
        {/* {mapData.map_image?.link && (
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
        )} */}
        <ImageOverlay
          ref={imgRef}
          bounds={[
            [0, 0],
            [0, 0],
          ]}
          url={
            "https://images.unsplash.com/photo-1668714298641-a221ceb27d0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          }
        />
      </MapContainer>
    </div>
  );
}
