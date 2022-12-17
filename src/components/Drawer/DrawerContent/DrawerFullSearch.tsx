import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch } from "../../../CRUD/OtherCRUD";
import { BoardType, NodeType } from "../../../types/boardTypes";
import { DocumentType } from "../../../types/documentTypes";
import { AvailableSearchResultTypes } from "../../../types/generalTypes";
import { MapPinType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { getIconForFullSearch, getLinkForFullSearch } from "../../../utils/transform";

export default function DrawerFullSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    documents: DocumentType[];
    maps: MapType[];
    pins: MapPinType[];
    boards: BoardType[];
    nodes: NodeType[];
  }>({ documents: [], maps: [], boards: [], pins: [], nodes: [] });
  const [, setDrawer] = useAtom(DrawerAtom);
  const { project_id } = useParams();
  const { mutate } = useFullSearch(project_id as string);

  const debounceSearch = useDebouncedCallback((search: string) => {
    mutate(search, {
      onSuccess: (data: { documents: []; maps: []; boards: []; pins: []; nodes: [] }) => setResults(data),
    });
  }, 500);
  return (
    <div>
      <h2 className="w-full text-center font-Lato text-2xl">Search all items</h2>
      <InputText
        autoFocus
        className="w-full"
        onChange={(e) => {
          setQuery(e.target.value);
          debounceSearch(e.target.value);
        }}
        value={query}
      />
      <ul className="mt-2 flex flex-col gap-y-2 font-Lato">
        {Object.keys(results).length
          ? Object.keys(results).map((key) =>
              results[key as AvailableSearchResultTypes].map((item) => (
                <li key={item.id} className="flex cursor-pointer truncate py-1 hover:bg-sky-400">
                  <Link
                    className="flex items-center gap-x-1"
                    onClick={() => setDrawer(DefaultDrawer)}
                    to={getLinkForFullSearch(
                      item.id,
                      item.parent as string,
                      key as AvailableSearchResultTypes,
                      project_id as string,
                    )}>
                    <Icon fontSize={24} icon={getIconForFullSearch(item)} />
                    {"title" in item && item.title} {"text" in item && (item?.text || "Map Pin")}
                    {"label" in item && (item.label || "Node")}
                  </Link>
                </li>
              )),
            )
          : (query && "No items match this query.") || ""}
      </ul>
    </div>
  );
}
