import { SetStateAction } from "jotai";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";
import { DebouncedState, useDebouncedCallback } from "use-debounce";

import { useDeleteImage, useGetAllSettingsImages } from "../../../CRUD/ItemsCRUD";
import { ListGridItem } from "./GridItem";
import { ListAssetItem } from "./ListItem";

function AssetSettingsHeader(
  layout: "list" | "grid",
  filter: "all" | "image" | "map",
  setLayout: Dispatch<SetStateAction<"list" | "grid">>,
  setFilter: Dispatch<SetStateAction<"all" | "image" | "map">>,
  setSearch: DebouncedState<(input: string) => void>,
) {
  return (
    <div className="flex items-center gap-x-4">
      <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as "list" | "grid")} />
      <Dropdown
        className="w-32"
        onChange={(e) => setFilter(e.value as "all" | "image" | "map")}
        optionLabel="label"
        options={[
          {
            label: "All",
            value: "all",
          },
          {
            label: "Image",
            value: "image",
          },
          {
            label: "Map",
            value: "map",
          },
        ]}
        placeholder="Sort By Price"
        value={filter}
      />
      <InputText placeholder="Search" onChange={(e) => setSearch(e.currentTarget.value)} />
    </div>
  );
}

export default function AssetSettings() {
  const { project_id } = useParams();
  const { data: images, isFetching } = useGetAllSettingsImages(project_id as string);
  const [layout, setLayout] = useState<"grid" | "list">("list");
  const [filter, setFilter] = useState<"all" | "image" | "map">("all");
  const [search, setSearch] = useState("");

  const { mutate: deleteImage } = useDeleteImage(project_id as string);

  const debouncedSearch = useDebouncedCallback((input: string) => {
    setSearch(input);
  }, 500);

  return (
    <div className="p-4">
      <DataView
        className={`p-dataview-${layout}`}
        header={AssetSettingsHeader(layout, filter, setLayout, setFilter, debouncedSearch)}
        itemTemplate={(item) => (layout === "list" ? ListAssetItem(item, deleteImage) : ListGridItem)}
        layout={layout}
        loading={isFetching}
        paginator
        rows={layout === "list" ? 10 : 18}
        value={images
          ?.filter((image) => {
            if (filter === "image") return !image.includes("maps");
            if (filter === "map") return image.includes("maps");
            return true;
          })
          ?.filter((image) => image.toLowerCase().includes(search.toLowerCase()))}
      />
    </div>
  );
}
