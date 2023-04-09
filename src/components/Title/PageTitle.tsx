import { useLocation, useParams } from "react-router-dom";

import { AvailableItemTypes } from "../../types/generalTypes";
import { getItemNameForSettings, getItemNameForTree } from "../../utils/transform";

export default function PageTitle() {
  const { type } = useParams();
  const { pathname } = useLocation();
  const isSettings = pathname.includes("settings");
  const itemName = isSettings ? getItemNameForSettings(type as string) : getItemNameForTree(type as AvailableItemTypes);
  return (
    <h2 className="h-8 truncate text-center font-Merriweather text-2xl capitalize delay-1000">
      {itemName && isSettings ? itemName : null}
      {itemName && !isSettings ? `${itemName.replace("y", "ies").replace("-", " ")}s` : null}
    </h2>
  );
}
