import { useParams } from "react-router-dom";

import EntityCreate from "../EntityView/EntityCreate";

export default function CreateView() {
  const { type } = useParams();
  if (type === "entities") return <EntityCreate />;
  return null;
}
