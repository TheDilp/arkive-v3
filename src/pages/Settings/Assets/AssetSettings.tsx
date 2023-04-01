import { SetStateAction } from "jotai";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";
import { DebouncedState, useDebouncedCallback } from "use-debounce";

import { useDeleteImage, useGetAllSettingsImages } from "../../../CRUD/ItemsCRUD";
import { bytesToSize } from "../../../utils/uiUtils";
import { ListGridItem } from "./GridItem";
import { ListAssetItem } from "./ListItem";

function AssetSettingsHeader(
  layout: "list" | "grid",
  filter: "all" | "image" | "map",
  setLayout: Dispatch<SetStateAction<"list" | "grid">>,
  setFilter: Dispatch<SetStateAction<"all" | "image" | "map">>,
  setSearch: DebouncedState<(input: string) => void>,
  size: number | undefined,
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
      <InputText onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Search" />
      {size ? <span>Total storage used: {bytesToSize(size)}</span> : null}
    </div>
  );
}

export default function AssetSettings() {
  const { project_id } = useParams();
  const { data, isFetching } = useGetAllSettingsImages(project_id as string);
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
        header={AssetSettingsHeader(layout, filter, setLayout, setFilter, debouncedSearch, data?.size)}
        // @ts-ignore
        itemTemplate={(item) => (layout === "list" ? ListAssetItem(item, deleteImage) : ListGridItem(item))}
        layout={layout}
        loading={isFetching}
        paginator
        rows={layout === "list" ? 10 : 18}
        value={(data?.images || [])
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
