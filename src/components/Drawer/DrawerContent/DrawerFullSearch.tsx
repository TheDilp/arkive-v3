import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { div, TabView } from "primereact/tabview";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch } from "../../../CRUD/OtherCRUD";
import { BoardType, EdgeType, NodeType } from "../../../types/boardTypes";
import { DocumentType } from "../../../types/documentTypes";
import { AvailableSearchResultTypes } from "../../../types/generalTypes";
import { MapPinType, MapType } from "../../../types/mapTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { getSearchTags, getTags } from "../../../utils/CRUD/CRUDFunctions";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { getIconForFullSearch, getLinkForFullSearch } from "../../../utils/transform";

const SearchDefault = { documents: [], maps: [], boards: [], pins: [], nodes: [], edges: [] };
export default function DrawerFullSearch() {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [menuIndex, setMenuIndex] = useState(0);
  const [results, setResults] = useState<{
    documents: DocumentType[];
    maps: MapType[];
    pins: MapPinType[];
    boards: BoardType[];
    nodes: NodeType[];
    edges: EdgeType[];
  }>(SearchDefault);
  const [, setDrawer] = useAtom(DrawerAtom);
  const { project_id } = useParams();
  const { mutate } = useFullSearch(project_id as string);
  const debounceSearch = useDebouncedCallback((searchQuery: string, type: "namecontent" | "tags") => {
    if (searchQuery)
      mutate(
        { query: searchQuery, type },
        {
          onSuccess: (data: { documents: []; maps: []; boards: []; pins: []; nodes: [] }) => setResults(data),
        },
      );
    else setResults(SearchDefault);
  }, 500);
  const debounceTags = useDebouncedCallback(async (tagsQuery: string) => {
    const t = await getSearchTags(project_id as string, tagsQuery);
    setFilteredTags(t);
  }, 500);
  return (
    <div className="flex flex-col">
      <div className="min-h-[9rem]">
        <TabMenu
          activeIndex={menuIndex}
          model={[{ label: "Name & Content" }, { label: "Tags" }]}
          onTabChange={(e) => setMenuIndex(e.index)}
        />
        {menuIndex === 0 ? (
          <div>
            <h2 className="w-full text-center font-Lato text-2xl">Search all items</h2>
            <InputText
              autoFocus
              className="w-full"
              onChange={(e) => {
                setQuery(e.target.value);
                debounceSearch(e.target.value, "namecontent");
              }}
              value={query}
            />
          </div>
        ) : null}
        {menuIndex === 1 ? (
          <div>
            <h2 className="w-full text-center font-Lato text-2xl">Search all items</h2>
            <AutoComplete
              className="w-full"
              completeMethod={(e) => debounceTags(e.query)}
              inputClassName="w-full"
              multiple
              onChange={(e) => setTags(e.value)}
              onSelect={(e) => debounceSearch(e.value, "tags")}
              suggestions={filteredTags}
              value={tags}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-col gap-y-2 font-Lato">
        {Object.keys(results).length
          ? Object.keys(results).map((key) =>
              results[key as AvailableSearchResultTypes].map((item) => (
                <Link
                  key={item.id}
                  className="flex cursor-pointer items-center gap-x-1 truncate py-1 hover:bg-sky-400"
                  onClick={() => setDrawer({ ...DefaultDrawer, position: "right" })}
                  to={getLinkForFullSearch(
                    item.id,
                    item.parent as string,
                    key as AvailableSearchResultTypes,
                    project_id as string,
                  )}>
                  <Icon fontSize={24} icon={getIconForFullSearch(item)} />
                  {"title" in item && item.title} {"text" in item && (item?.text || "Map Pin")}
                  {"label" in item && (item.label || "Node/Edge")}
                </Link>
              )),
            )
          : (query && "No items match this query.") || "Type something to search for documents, maps, pins, boards or nodes!"}
      </div>
    </div>
  );
}
