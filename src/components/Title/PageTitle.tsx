import { useParams } from "react-router-dom";

import { AvailableItemTypes } from "../../types/generalTypes";
import { getItemNameForTree } from "../../utils/transform";

export default function PageTitle() {
  const { type } = useParams();
  const itemName = getItemNameForTree(type as AvailableItemTypes);

  return (
    <h2 className="h-8 text-center font-Merriweather text-2xl capitalize delay-1000">
      {itemName ? `${itemName.replace("y", "ie")}s` : null}
    </h2>
  );
}
