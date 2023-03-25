import { SetStateAction } from "jotai";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Dispatch, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllSettingsImages } from "../../../CRUD/ItemsCRUD";
import { ListGridItem } from "./GridItem";
import { ListAssetItem } from "./ListItem";

function AssetSettingsHeader(
  layout: "list" | "grid",
  filter: "all" | "image" | "map",
  setLayout: Dispatch<SetStateAction<"list" | "grid">>,
  setFilter: Dispatch<SetStateAction<"all" | "image" | "map">>,
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
    </div>
  );
}

export default function AssetSettings() {
  const { project_id } = useParams();
  const { data: images, isFetching } = useGetAllSettingsImages(project_id as string);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "image" | "map">("all");
  return (
    <div className="p-4">
      <DataView
        header={AssetSettingsHeader(layout, filter, setLayout, setFilter)}
        itemTemplate={layout === "list" ? ListAssetItem : ListGridItem}
        layout={layout}
        loading={isFetching}
        paginator
        rows={5}
        value={images?.filter((image) => {
          if (filter === "image") return !image.includes("maps");
          if (filter === "map") return image.includes("maps");
          return true;
        })}
      />
    </div>
  );
}
