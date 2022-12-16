import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";
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
  console.log(results);
  return (
    <div>
      <InputText
        onChange={(e) => {
          setQuery(e.target.value);
          debounceSearch(e.target.value);
        }}
        value={query}
      />
      <ul>
        {results?.length
          ? results.map((item) => (
              <li key={item.id}>
                {"title" in item && item.title} {"text" in item && item?.text}
              </li>
            ))
          : "Type into the search bar to find anything."}
      </ul>
    </div>
  );
}
