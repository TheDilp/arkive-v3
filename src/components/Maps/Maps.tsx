import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { MapProps } from "../../custom-types";
import {
  useDeleteMap,
  useGetMaps,
  useUpdateMap,
} from "../../utils/customHooks";
import { mapItemDisplayDialogDefault } from "../../utils/defaultDisplayValues";
import { auth } from "../../utils/supabaseUtils";
import ItemTree from "../ItemTree";
import LoadingScreen from "../Util/LoadingScreen";
import MapView from "./Map/MapView";

export default function Maps() {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { data: maps, isLoading } = useGetMaps(project_id as string);
  const [mapId, setMapId] = useState("");
  const updateMapMutation = useUpdateMap(project_id as string);
  const deleteMapMutation = useDeleteMap();
  useEffect(() => {
    if (mapId) {
      navigate(mapId);
    }
  }, [mapId]);

  if (isLoading) return <LoadingScreen />;
  return !auth.user() ? (
    <Navigate to="/login" />
  ) : (
    <div className="w-full flex flex-nowrap justify-content-start mainScreen">
      {/* <MapsTree mapId={mapId} setMapId={setMapId} /> */}
      <ItemTree
        id={mapId}
        setId={setMapId}
        updateMutation={updateMapMutation}
        deleteMutation={deleteMapMutation}
        data={maps as MapProps[]}
        dialogDefault={mapItemDisplayDialogDefault}
      />
      <Routes>
        <Route path="/:map_id" element={<MapView setMapId={setMapId} />} />
      </Routes>
    </div>
  );
}
