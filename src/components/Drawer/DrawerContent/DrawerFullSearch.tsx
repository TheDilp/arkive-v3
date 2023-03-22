import { useAtomValue } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch, useGetAllTags, useSpecificSearch } from "../../../CRUD/OtherCRUD";
import { AllAvailableTypes, AvailableSearchResultTypes, FullSearchResults, TagType } from "../../../types/generalTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { searchCategories } from "../../../utils/searchUtils";
import SearchResultGroup from "../SearchResults/SearchResultGroup";

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

export default function DrawerFullSearch() {
  const drawer = useAtomValue(DrawerAtom);

  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AllAvailableTypes>(drawer?.data?.category || "documents");
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [menuIndex, setMenuIndex] = useState(drawer?.data?.index ?? 0);
  const [results, setResults] = useState<FullSearchResults>(SearchDefault);
  const { project_id } = useParams();
  const { mutate: searchMutation, isLoading: isSearching } = useFullSearch(project_id as string);
  const { mutate: specificSearchMutation, isLoading: isSearchingSpecific } = useSpecificSearch(project_id as string);
  const { data: allTags } = useGetAllTags(project_id as string);

  const debounceSearch = useDebouncedCallback(
    async (searchQuery: string | TagType[], type: "namecontent" | "tags" | "category") => {
      if (searchQuery) {
        const finalQuery = Array.isArray(searchQuery) ? searchQuery.map((tag) => tag.title) : searchQuery;

        if ((!Array.isArray(searchQuery) && searchQuery.length >= 3) || Array.isArray(searchQuery)) {
          if (type === "category" && typeof searchQuery === "string") {
            specificSearchMutation(
              { searchQuery, selectedCategory },
              { onSuccess: (data) => setResults({ ...SearchDefault, [selectedCategory]: data }) },
            );
          } else {
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
        }
      } else setResults(SearchDefault);
    },
    500,
  );

  const debounceTags = useDebouncedCallback((tagsQuery: string) => {
    const t = allTags?.filter((tag) => tag.title.toLowerCase().includes(tagsQuery.toLowerCase()));
    if (t && t.length) setFilteredTags(t);
    else setFilteredTags([]);
  }, 500);

  useEffect(() => {
    if (drawer?.data) {
      if (typeof drawer?.data?.index === "number") setMenuIndex(drawer?.data?.index);
      if (drawer?.data?.category) setSelectedCategory(drawer?.data?.category);
    }
  }, [drawer?.data]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <TabMenu
          activeIndex={menuIndex}
          className="searchTabs"
          model={[{ label: "Title" }, { label: "Category" }, { label: "Tags" }]}
          onTabChange={(e) => setMenuIndex(e.index)}
        />
        {menuIndex === 0 || menuIndex === 1 ? (
          <div className="flex w-full flex-nowrap items-center justify-between gap-2">
            <span className="p-input-icon-right w-full">
              {isSearching || isSearchingSpecific ? <i className="pi pi-spin pi-spinner" /> : null}
              <InputText
                autoFocus
                className="w-full"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debounceSearch(e.target.value, menuIndex ? "category" : "namecontent");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") debounceSearch(e.currentTarget.value, menuIndex ? "category" : "namecontent");
                }}
                placeholder="Enter at least 3 characters"
                value={query}
              />
            </span>
            {menuIndex === 1 ? (
              <Dropdown
                className="min-w-[10rem]"
                onChange={(e) => {
                  setSelectedCategory(e.value);
                  if (query.length >= 3) debounceSearch(query, "category");
                }}
                options={searchCategories}
                value={selectedCategory}
              />
            ) : null}
          </div>
        ) : null}

        {menuIndex === 2 ? (
          <div className="flex w-full flex-col">
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
        {!isSearching && results && Object.keys(results).length > 0
          ? Object.keys(results).map((key) => (
              <SearchResultGroup
                key={key}
                items={results[key as AvailableSearchResultTypes]}
                itemType={key as AvailableSearchResultTypes}
              />
            ))
          : (query && !isSearching && "No items match this query.") || ""}
      </div>
    </div>
  );
}
