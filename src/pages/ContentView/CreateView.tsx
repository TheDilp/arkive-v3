import { Navigate, To, useParams } from "react-router-dom";

import EntityCreate from "../EntityView/EntityCreate";
import EntityInstanceCreate from "../EntityView/EntityInstanceCreate";

export default function CreateView() {
  const { type } = useParams();
  if (type === "entities") return <EntityCreate />;
  if (type === "entity_instances") return <EntityInstanceCreate />;
  return <Navigate to={-1 as To} />;
}
