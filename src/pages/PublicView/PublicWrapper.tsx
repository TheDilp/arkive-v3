import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useGetItem } from "../../hooks/useGetItem";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { toaster } from "../../utils/toast";
import BoardView from "../BoardView/BoardView";
import MapView from "../MapView/MapView";
import PublicDocumentView from "./PublicDocumentView";

export default function PublicWrapper() {
  const { type, item_id } = useParams();
  const user = useAuth();

  const { data, isLoading } = useGetItem<AllItemsType>(item_id as string, type as AvailableItemTypes, {
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
  if (!user || isLoading) return <ProgressSpinner />;
  if (!data?.isPublic && !isLoading) {
    toaster("warning", "That page is not public.");
    return null;
  }
  if (data) {
    if (type === "documents") return <PublicDocumentView data={data} />;
    if (type === "maps") return <MapView isReadOnly />;
    if (type === "boards") return <BoardView isReadOnly />;
  }
  return null;
}
