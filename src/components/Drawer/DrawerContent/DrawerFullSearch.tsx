import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch, useGetAllTags } from "../../../CRUD/OtherCRUD";
import { AvailableSearchResultTypes, FullSearchResults, TagType } from "../../../types/generalTypes";
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
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [menuIndex, setMenuIndex] = useState(0);
  const [results, setResults] = useState<FullSearchResults>(SearchDefault);
  const { project_id } = useParams();
  const { mutate: searchMutation, isLoading: isSearching } = useFullSearch(project_id as string);
  const { data: allTags } = useGetAllTags(project_id as string);

  const debounceSearch = useDebouncedCallback((searchQuery: string | TagType[], type: "namecontent" | "tags" | "category") => {
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
          className="searchTabs"
          model={[{ label: "Title" }, { label: "Category" }, { label: "Tags" }]}
          onTabChange={(e) => setMenuIndex(e.index)}
        />
        {menuIndex === 0 ? (
          <div className="flex w-full flex-col">
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
            <span className="p-input-icon-right w-full">
              {isSearching ? <i className="pi pi-spin pi-spinner" /> : null}
              <InputText
                autoFocus
                className="w-full"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debounceSearch(e.target.value, "category");
                }}
                placeholder="Enter at least 3 characters"
                value={query}
              />
            </span>
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
        {results && Object.keys(results).length > 0
          ? Object.keys(results).map((key) => (
              <SearchResultGroup
                key={key}
                items={results[key as AvailableSearchResultTypes]}
                itemType={key as AvailableSearchResultTypes}
              />
            ))
          : (query && "No items match this query.") || ""}
      </div>
    </div>
  );
}
