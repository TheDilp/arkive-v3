import { Icon } from "@iconify/react";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useFullSearch } from "../../../CRUD/OtherCRUD";
import { AllItemsType, AllSubItemsType } from "../../../types/generalTypes";

export default function DrawerFullSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(AllItemsType | AllSubItemsType)[]>([]);
  const { project_id } = useParams();
  const { mutate } = useFullSearch(project_id as string);

  const debounceSearch = useDebouncedCallback((search: string) => {
    mutate(search, {
      onSuccess: (data: (AllItemsType | AllSubItemsType)[]) => setResults(data),
    });
  }, 500);
  return (
    <div>
      <h2 className="w-full text-center font-Lato text-2xl">Search all items</h2>
      <InputText
        className="w-full"
        onChange={(e) => {
          setQuery(e.target.value);
          debounceSearch(e.target.value);
        }}
        value={query}
      />
      <ul className="mt-2 flex flex-col gap-y-2 font-Lato">
        {results?.length
          ? results.map((item) => (
              <li key={item.id} className="flex cursor-pointer py-1 hover:bg-sky-400">
                <Link className="flex" to={`/project/${project_id}/documents/${item.id}`}>
                  {"icon" in item && <Icon fontSize={24} icon={item.icon || "mdi:file"} />}
                  {"text" in item && <Icon icon="mdi:map_marker" />}
                  {"label" in item && <Icon icon="mdi:cog" />}
                  {"title" in item && item.title} {"text" in item && (item?.text || "Map Pin")}
                  {"label" in item && (item.label || "Node")}
                </Link>
              </li>
            ))
          : "Type into the search bar to find anything."}
      </ul>
    </div>
  );
}
