import { useAtomValue } from "jotai";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch, useGetAllTags, useSpecificSearch } from "../../../CRUD/OtherCRUD";
import { useKeyPress } from "../../../hooks/useNavigateSearchResults";
import { AllAvailableTypes, AvailableSearchResultTypes, FullSearchResults, TagType } from "../../../types/generalTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { searchCategories } from "../../../utils/searchUtils";
import { getLinkForFullSearch } from "../../../utils/transform";
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
  const { project_id } = useParams();
  const searchInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const drawer = useAtomValue(DrawerAtom);
  const navigate = useNavigate();

  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");

  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AllAvailableTypes>(drawer?.data?.category || "documents");
  const [filteredTags, setFilteredTags] = useState<TagType[]>([]);
  const [menuIndex, setMenuIndex] = useState(drawer?.data?.index ?? 0);
  const [index, setIndex] = useState({ category: 0, index: 0 });
  const [results, setResults] = useState<FullSearchResults>(SearchDefault);

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

  const keyPressResults = useMemo(
    () =>
      Object.entries(results)
        .filter(([, value]) => value.length)
        .map(([, value]) => value),
    [results],
  );

  useEffect(() => {
    if (drawer?.data) {
      if (typeof drawer?.data?.index === "number") setMenuIndex(drawer?.data?.index);
      if (drawer?.data?.category) setSelectedCategory(drawer?.data?.category);
    }
  }, [drawer?.data]);
  useEffect(() => {
    if (downPress && keyPressResults.some((res) => res.length) && document.activeElement === searchInputRef.current) {
      const currentIndex = index.index;
      if (currentIndex === keyPressResults[index.category].length - 1) {
        const newCategory = index.category + 1;
        if (newCategory > keyPressResults.length - 1) setIndex({ category: 0, index: 0 });
        else setIndex({ category: newCategory, index: 0 });
      } else {
        setIndex((prev) => ({ ...prev, index: prev.index + 1 }));
      }
    }
  }, [downPress]);
  useEffect(() => {
    if (upPress && keyPressResults.some((res) => res.length) && document.activeElement === searchInputRef.current) {
      const currentIndex = index.index;

      if (currentIndex === 0) {
        const newCategory = index.category - 1;
        if (newCategory < 0) {
          setIndex({ category: keyPressResults.length - 1, index: keyPressResults[keyPressResults.length - 1].length - 1 });
        } else {
          setIndex({ category: newCategory, index: keyPressResults[newCategory].length - 1 });
        }
      } else {
        setIndex((prev) => ({ category: prev.category, index: prev.index - 1 }));
      }
    }
  }, [upPress]);

  useEffect(() => {
    if (enterPress && document.activeElement === searchInputRef.current) {
      const item = keyPressResults?.[index.category]?.[index.index];
      if (item) {
        const type = Object.entries(results)
          .filter(([, value]) => value.length)
          .map(([key]) => key)[index.category] as AvailableSearchResultTypes;

        const link = getLinkForFullSearch(
          "document" in item && item?.document?.id ? item?.document?.id : item.id,
          "parentId" in item ? (item.parentId as string) : (item.calendarsId as string),
          type,
          project_id as string,
          "folder" in item ? item.folder : false,
        );
        navigate(link);
      }
    }
  }, [enterPress]);

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
                ref={searchInputRef}
                autoFocus
                className="w-full"
                onChange={(e) => {
                  setQuery(e.target.value);
                  debounceSearch(e.target.value, menuIndex ? "category" : "namecontent");
                }}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") debounceSearch(e.currentTarget.value, menuIndex ? "category" : "namecontent");
                // }}
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
              inputRef={searchInputRef}
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
          ? Object.entries(results)
              .filter(([, value]) => value.length !== 0)
              .map(([key], idx) => (
                <SearchResultGroup
                  key={key}
                  index={idx === index.category ? index.index : undefined}
                  items={results[key as AvailableSearchResultTypes]}
                  itemType={key as AvailableSearchResultTypes}
                />
              ))
          : (query && !isSearching && "No items match this query.") || ""}
      </div>
    </div>
  );
}
