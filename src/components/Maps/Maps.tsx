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
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-wrap justify-content-start">
      <MapsTree mapId={mapId} />
      <Routes>
        <Route path="/:map_id" element={<MapView setMapId={setMapId} />} />
      </Routes>
    </div>
  );
}
