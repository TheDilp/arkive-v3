import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useGetMaps } from "../../utils/customHooks";
import { auth } from "../../utils/supabaseUtils";
import LoadingScreen from "../Util/LoadingScreen";
import MapView from "./Map/MapView";
import MapsTree from "./MapsTree/MapsTree";
export default function Maps() {
  const { project_id } = useParams();
  const { data: maps, isLoading } = useGetMaps(project_id as string);
  const [mapId, setMapId] = useState("");

  if (isLoading) return <LoadingScreen />;
  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-nowrap justify-content-start mainScreen">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
        integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
        crossOrigin=""
      />
      <MapsTree mapId={mapId} setMapId={setMapId} />
      <Routes>
        <Route path="/:map_id">
          <Route index element={<MapView setMapId={setMapId} />} />
          <Route path=":marker_id" element={<MapView setMapId={setMapId} />} />
        </Route>
      </Routes>
    </div>
  );
}
