import { Icon } from "@iconify/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Link, useParams } from "react-router-dom";
import { capitalCase } from "remirror";

import { AvailableSearchResultTypes, SearchResultType } from "../../../types/generalTypes";
import { BoardReferenceAtom, DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { getIconForFullSearch, getSearchGroupIcon, goToNodeEdge } from "../../../utils/searchUtils";
import { getLinkForFullSearch } from "../../../utils/transform";
import SearchResult from "./SearchResult";

type Props = {
  items: SearchResultType[];
  itemType: AvailableSearchResultTypes;
  index: number | undefined;
};

export default function SearchResultGroup({ items, itemType, index }: Props) {
  const { project_id, subitem_id } = useParams();

  const setDrawer = useSetAtom(DrawerAtom);
  const boardRef = useAtomValue(BoardReferenceAtom);
  if (!items.length) return null;
  return (
    <div>
      <h5 className="mb-1 flex items-center gap-x-1 border-b border-zinc-700 text-lg font-semibold">
        <Icon fontSize={24} icon={getSearchGroupIcon(itemType)} />
        {capitalCase(itemType)}
      </h5>
      {Array.isArray(items)
        ? items.map((item, itemIdx) => (
            <Link
              key={item.id}
              className={`flex cursor-pointer items-center gap-x-1 py-1 hover:bg-sky-400 ${
                index === itemIdx ? "bg-blue-300" : ""
              }`}
              onClick={() => {
                if (boardRef) goToNodeEdge(subitem_id, item.id, boardRef);
                setDrawer({ ...DefaultDrawer, position: "right" });
              }}
              to={getLinkForFullSearch(
                "document" in item && item?.document?.id ? item?.document?.id : item.id,
                "parentId" in item ? (item.parentId as string) : (item.calendarsId as string),
                itemType,
                project_id as string,
                "folder" in item ? item.folder : false,
              )}>
              <div className="flex items-center pl-0.5 ">
                <Icon fontSize={18} icon={getIconForFullSearch(item)} />
                <SearchResult item={item} />
              </div>
            </Link>
          ))
        : null}
    </div>
  );
}
