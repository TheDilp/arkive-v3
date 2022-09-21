import { useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
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
    <Navigate to="/auth" />
  ) : (
    <div className="w-full flex flex-nowrap justify-content-start mainScreen">
      <MapsTree mapId={mapId} setMapId={setMapId} />
      <Routes>
        <Route path="/:map_id">
          <Route
            index
            element={<MapView public_view={false} setMapId={setMapId} />}
          />
          <Route
            path=":marker_id"
            element={<MapView public_view={false} setMapId={setMapId} />}
          />
        </Route>
      </Routes>
    </div>
  );
}
