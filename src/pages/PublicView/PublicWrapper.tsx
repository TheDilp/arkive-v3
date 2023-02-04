import { useParams } from "react-router-dom";

import BoardView from "../BoardView/BoardView";
import MapView from "../MapView/MapView";
import PublicDocumentView from "./PublicDocumentView";

export default function PublicWrapper() {
  const { type } = useParams();

  if (type === "documents") return <PublicDocumentView />;
  if (type === "maps") return <MapView isReadOnly />;
  if (type === "boards") return <BoardView isReadOnly />;

  return null;
}
