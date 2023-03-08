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

const SearchDefault = {
  documents: [],
  maps: [],
  boards: [],
  pins: [],
  nodes: [],
  edges: [],
  screens: [],
  sections: [],
  calendars: [],
  timelines: [],
  events: [],
};

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
  const [tags, setTags] = useState<TagType[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [menuIndex, setMenuIndex] = useState(0);
  const [results, setResults] = useState<FullSearchResults>(SearchDefault);
  const [, setDrawer] = useAtom(DrawerAtom);
  const { project_id, subitem_id } = useParams();
  const { mutate: searchMutation, isLoading: isSearching } = useFullSearch(project_id as string);
  const { data: allTags } = useGetAllTags(project_id as string);

  const debounceSearch = useDebouncedCallback((searchQuery: string | TagType[], type: "namecontent" | "tags") => {
    if (searchQuery) {
      const finalQuery = Array.isArray(searchQuery) ? searchQuery.map((tag) => tag.title) : searchQuery;

      if ((!Array.isArray(searchQuery) && searchQuery.length >= 3) || Array.isArray(searchQuery)) {
        searchMutation(
          { query: finalQuery, type },
          {
            onSuccess: (data: {
              documents: [];
              maps: [];
              boards: [];
              pins: [];
              nodes: [];
              edges: [];
              screens: [];
              sections: [];
              calendars: [];
              timelines: [];
              events: [];
            }) => setResults(data),
          },
        );
      }
    } else setResults(SearchDefault);
  }, 500);

  const debounceTags = useDebouncedCallback((tagsQuery: string) => {
    const t = allTags?.filter((tag) => tag.title.toLowerCase().includes(tagsQuery.toLowerCase()));
    if (t && t.length) setFilteredTags(t);
    else setFilteredTags([]);
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

            <span className="p-input-icon-right w-full">
              {isSearching ? <i className="pi pi-spin pi-spinner" /> : null}
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
            </span>
          </div>
        ) : null}
        {menuIndex === 1 ? (
          <div className="flex w-full flex-col">
            <h2 className="w-full text-center font-Lato text-2xl">Search by Tag</h2>
            <AutoComplete
              autoFocus
              className="w-full"
              completeMethod={(e) => debounceTags(e.query)}
              field="title"
              multiple
              onChange={(e) => setTags(e.value)}
              onSelect={(e) => debounceSearch([...tags, e.value], "tags")}
              onUnselect={(e) =>
                debounceSearch(
                  tags.filter((tag) => tag.id !== e.value.id),
                  "tags",
                )
              }
              placeholder="Search by tag"
              suggestions={filteredTags}
              value={tags}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex flex-col gap-y-2 font-Lato">
        {isSearching ? "Searching..." : null}
        {results && Object.keys(results).length > 0
          ? Object.keys(results).map((key) =>
              Array.isArray(results[key as AvailableSearchResultTypes])
                ? results[key as AvailableSearchResultTypes].map((item) => (
                    <Link
                      key={item.id}
                      className="flex cursor-pointer items-center gap-x-1 py-1 hover:bg-sky-400"
                      onClick={() => {
                        if (boardRef) goToNodeEdge(subitem_id, item.id, boardRef);
                        setDrawer({ ...DefaultDrawer, position: "right" });
                      }}
                      to={getLinkForFullSearch(
                        item.id,
                        "parentId" in item ? (item.parentId as string) : (item.calendarsId as string),
                        key as AvailableSearchResultTypes,
                        project_id as string,
                        "folder" in item ? item.folder : false,
                      )}>
                      <Icon fontSize={24} icon={getIconForFullSearch(item)} />
                      <span className="flex flex-col">
                        {"title" in item && item.title} {"text" in item && (item?.text || "Map Pin")}
                        {"label" in item && "source" in item ? item.label || "Edge" : null}
                        {"label" in item && !("source" in item) ? item.label || "Node" : null}
                        <span className="text-xs">
                          {"source" in item
                            ? `(${item.source?.label || "Unnamed node"} - ${item.target?.label || "Unnamed node"})`
                            : null}
                        </span>
                      </span>
                    </Link>
                  ))
                : null,
            )
          : (query && "No items match this query.") || ""}
      </div>
    </div>
  );
}
