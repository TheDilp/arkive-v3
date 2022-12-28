import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useGetAllImages } from "../../CRUD/ItemsCRUD";
import { FolderViewCards } from "../../pages/FolderView/FolderViewCards";
import { DocumentType } from "../../types/documentTypes";
import { getImageLink } from "../../utils/CRUD/CRUDUrls";

type Props = {
  type: "documents" | "images";
};

export default function NodeFrom({ type }: Props) {
  const queryClient = useQueryClient();
  const { project_id } = useParams();
  const data: DocumentType[] | undefined = queryClient.getQueryData(["allitems", project_id, type]);
  const { data: allImages } = useGetAllImages(project_id as string, { enabled: type === "images" });
  return (
    <div className="max-w-md">
      {type === "documents" ? (
        <FolderViewCards items={data?.filter((doc) => !doc.folder && !doc.template) || []} type="documents" />
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
              src={getImageLink(image, project_id as string)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
