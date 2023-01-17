import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";

import { useGetAllSettingsImages } from "../../../CRUD/ItemsCRUD";
import { getImageLink, getMapImageLink } from "../../../utils/CRUD/CRUDUrls";

function ImageColumn(rowData: { image: string; type: string }) {
  const { project_id } = useParams();
  const { image, type } = rowData;
  return image ? (
    <div className="flex h-8 w-full justify-center">
      <Image
        alt={image || "column"}
        className="h-full w-16"
        imageClassName="object-contain"
        preview
        src={type === "image" ? getImageLink(image, project_id as string) : getMapImageLink(image, project_id as string)}
      />
    </div>
  ) : null;
}

export default function AssetSettings() {
  const { project_id } = useParams();
  const { data: images, isFetching } = useGetAllSettingsImages(project_id as string);
  // const [selected, setSelected] = useState<DocumentType[]>([]);
  return isFetching ? (
    <ProgressSpinner />
  ) : (
    <div className="p-4">
      <DataTable value={images}>
        <Column headerClassName="w-12" selectionMode="multiple" />
        <Column field="image" header="Title" sortable />
        <Column body={ImageColumn} className="max-w-[15rem] truncate" field="image" header="Image" sortable />

        {/* <Column align="center" body={(data) => DeleteColumn(data, deleteAction)} header="Actions" /> */}
      </DataTable>
    </div>
  );
}
