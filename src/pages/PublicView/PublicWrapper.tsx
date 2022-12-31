import { ProgressSpinner } from "primereact/progressspinner";
import { Navigate, useLocation, useParams } from "react-router-dom";

import { useGetItem } from "../../hooks/useGetItem";
import { AllItemsType } from "../../types/generalTypes";
import { toaster } from "../../utils/toast";
import { getItemTypeFromURL } from "../../utils/transform";
import BoardView from "../BoardView/BoardView";
import MapView from "../MapView/MapView";
import PublicDocumentView from "./PublicDocumentView";

export default function PublicWrapper() {
  const { item_id } = useParams();
  const { pathname } = useLocation();
  const type = getItemTypeFromURL(pathname);
  const { data, isLoading } = useGetItem(item_id as string, type) as { data: AllItemsType; isLoading: boolean };

  if (isLoading) return <ProgressSpinner />;

  if (!data?.isPublic && !isLoading) {
    toaster("warning", "That page is not public.");
    return <Navigate to="/" />;
  }
  if (data) {
    if (type === "documents") return <PublicDocumentView data={data} />;
    if (type === "maps") return <MapView isReadOnly />;
    if (type === "boards") return <BoardView isReadOnly />;
  }
  return null;
}
