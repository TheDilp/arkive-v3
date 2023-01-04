import { Icon } from "@iconify/react";
import { Core } from "cytoscape";
import { useAtom } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch, useGetAllTags } from "../../../CRUD/OtherCRUD";
import { AvailableSearchResultTypes, FullSearchResults, TagType } from "../../../types/generalTypes";
import { BoardReferenceAtom, DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { getIconForFullSearch, getLinkForFullSearch } from "../../../utils/transform";

const SearchDefault = { documents: [], maps: [], boards: [], pins: [], nodes: [], edges: [] };

function goToNodeEdge(subitem_id: string | undefined, id: string, boardRef: Core) {
  if (subitem_id === id) {
    const node = boardRef.getElementById(subitem_id);

    if (node)
      boardRef?.animate({
        center: {
          eles: node,
        },
      });
  }
}

export default function DrawerFullSearch() {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [menuIndex, setMenuIndex] = useState(0);
  const [results, setResults] = useState<FullSearchResults>(SearchDefault);
  const [, setDrawer] = useAtom(DrawerAtom);
  const { project_id, subitem_id } = useParams();
  const { mutate } = useFullSearch(project_id as string);
  const { data: allTags } = useGetAllTags(project_id as string);
  const debounceSearch = useDebouncedCallback((searchQuery: string, type: "namecontent" | "tags") => {
    if (searchQuery && searchQuery.length >= 3)
      mutate(
        { query: searchQuery, type },
        {
          onSuccess: (data: { documents: []; maps: []; boards: []; pins: []; nodes: []; edges: [] }) => setResults(data),
        },
      );
    else setResults(SearchDefault);
  }, 500);

  const debounceTags = useDebouncedCallback(async (tagsQuery: string) => {
    const t = allTags?.filter((tag) => tag.title.toLowerCase().includes(tagsQuery.toLowerCase()));
    if (t && t.length) setFilteredTags(t);
  }, 500);
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
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
              placeholder="Enter at least 3 characters"
              value={query}
            />
          </div>
        ) : null}
        {menuIndex === 1 ? (
          <div className="flex w-full flex-col">
            <h2 className="w-full text-center font-Lato text-2xl">Search by Tag</h2>
            <AutoComplete
              className="w-full"
              completeMethod={(e) => debounceTags(e.query)}
              field="title"
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
        {results && Object.keys(results).length > 0
          ? Object.keys(results).map((key) =>
              Array.isArray(results[key as AvailableSearchResultTypes])
                ? results[key as AvailableSearchResultTypes].map((item) => (
                    <Link
                      key={item.id}
                      className="flex cursor-pointer items-center gap-x-1 truncate py-1 hover:bg-sky-400"
                      onClick={() => {
                        if (boardRef) goToNodeEdge(subitem_id, item.id, boardRef);
                        setDrawer({ ...DefaultDrawer, position: "right" });
                      }}
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
                  ))
                : "No items match this query.",
            )
          : (query && "No items match this query.") || "Type something to search for documents, maps, pins, boards or nodes!"}
      </div>
    </div>
  );
}
