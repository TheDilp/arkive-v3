import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";

import { useGetAllImages, useGetAllItems } from "../../CRUD/ItemsCRUD";
import { FolderViewCards } from "../../pages/FolderView/FolderViewCards";
import { baseURLS } from "../../types/CRUDenums";
import { DocumentType } from "../../types/ItemTypes/documentTypes";

type Props = {
  type: "documents" | "images";
};

export default function NodeFrom({ type }: Props) {
  const { project_id } = useParams();
  const { data: documents, isFetching } = useGetAllItems<DocumentType>(project_id as string, "documents", {
    staleTime: 5 * 60 * 1000,
  });
  const { data: allImages } = useGetAllImages(project_id as string, { enabled: type === "images", staleTime: 5 * 60 * 1000 });

  if (isFetching) return <ProgressSpinner />;
  return (
    <div className="max-w-md">
      {type === "documents" ? (
        <FolderViewCards items={documents?.filter((doc) => !doc.folder && !doc.template) || []} type="documents" />
      ) : (
        <div className="flex w-full flex-wrap gap-2 overflow-y-auto">
          {allImages?.map((image) => (
            <img
              key={image}
              alt={image}
              className="h-24 w-24 object-contain"
              onDragStart={(e) => {
                e.dataTransfer.setData("item_id", JSON.stringify({ image, type }));
              }}
              src={`${baseURLS.baseImageHost}${image}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
