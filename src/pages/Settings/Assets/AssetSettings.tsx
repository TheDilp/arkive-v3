import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllSettingsImages } from "../../../CRUD/ItemsCRUD";

type Props = {};

function Header() {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const sortOptions = [
    { label: "Price High to Low", value: "!price" },
    { label: "Price Low to High", value: "price" },
  ];

  return (
    <div className="grid-nogutter grid">
      <div className="col-6" style={{ textAlign: "left" }}>
        <Dropdown
          onChange={onSortChange}
          optionLabel="label"
          options={sortOptions}
          placeholder="Sort By Price"
          value={sortKey}
        />
      </div>
      <div className="col-6" style={{ textAlign: "right" }}>
        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
      </div>
    </div>
  );
}
const itemTemplate = (product, layout): string | null => {
  console.log(product, layout);
  if (!product) {
    return null;
  }

  if (layout === "list") return "LIST";
  if (layout === "grid") return "GRID";
  return null;
};
export default function AssetSettings({}: Props) {
  const { project_id } = useParams();
  const { data: images } = useGetAllSettingsImages(project_id as string);
  const [layout, setLayout] = useState("list");
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  return (
    <DataView
      // header={Header}
      itemTemplate={itemTemplate}
      layout={layout}
      paginator
      rows={9}
      sortField={sortField}
      sortOrder={sortOrder}
      value={images}
    />
  );
}
