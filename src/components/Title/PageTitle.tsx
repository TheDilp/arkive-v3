import { useLocation, useParams } from "react-router-dom";

import { AvailableItemTypes } from "../../types/generalTypes";
import { getItemNameForSettings, getItemNameForTitle } from "../../utils/transform";

function getItemName(isSettings: boolean, type: string) {
  return isSettings ? getItemNameForSettings(type as string) : getItemNameForTitle(type as AvailableItemTypes);
}

export default function PageTitle() {
  const { type } = useParams();
  const { pathname } = useLocation();
  const isSettings = pathname.includes("settings");
  const itemName = getItemName(isSettings, type as string);
  return (
    <h2 className="h-8 truncate text-center font-Merriweather text-2xl capitalize delay-1000">
      {itemName && isSettings ? itemName : null}
      {itemName && !isSettings ? `${itemName.replace("y", "ies").replace("-", " ")}s` : null}
    </h2>
  );
}
