import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch } from "../../../CRUD/OtherCRUD";
import { BoardType, NodeType } from "../../../types/boardTypes";
import { DocumentType } from "../../../types/documentTypes";
import { AllItemsType, AllSubItemsType } from "../../../types/generalTypes";
import { MapPinType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";

type AvailableResultTypes = "documents" | "maps" | "boards" | "nodes" | "pins";
function getLinkForFullSearch(id: string, parent: string, type: AvailableResultTypes, project_id: string) {
  if (["documents", "maps", "boards"].includes(type)) return `/project/${project_id}/${type}/${id}`;
  if (type === "pins") return `/project/${project_id}/maps/${id}/${parent}`;
  if (type === "nodes") return `/project/${project_id}/maps/${id}/${parent}`;
  return "./";
}

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
        {Object.keys(results).map((key) =>
          results[key as AvailableResultTypes].map((item) => (
            <li key={item.id} className="flex cursor-pointer py-1 hover:bg-sky-400">
              <Link
                className="flex"
                onClick={() => setDrawer(DefaultDrawer)}
                to={getLinkForFullSearch(item.id, item.parent as string, key as AvailableResultTypes, project_id as string)}>
                {"icon" in item && <Icon fontSize={24} icon={item.icon || "mdi:file"} />}
                {"text" in item && <Icon icon="mdi:map_marker" />}
                {"label" in item && <Icon icon="mdi:cog" />}
                {"title" in item && item.title} {"text" in item && (item?.text || "Map Pin")}
                {"label" in item && (item.label || "Node")}
              </Link>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
