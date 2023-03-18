import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { useGetAllImages, useGetAllItems } from "../../CRUD/ItemsCRUD";
import { FolderViewCards } from "../../pages/FolderView/FolderViewCards";
import { DocumentType } from "../../types/ItemTypes/documentTypes";

type Props = {
  type: "documents" | "images";
};

export default function NodeFrom({ type }: Props) {
  const { project_id } = useParams();
  const { data: documents, isFetching } = useGetAllItems<DocumentType>(project_id as string, "documents", {
    staleTime: 5 * 60 * 1000,
  });
  const [search, setSearch] = useState("");

  const debounced = useDebouncedCallback((text: string) => {
    setSearch(text);
  }, 400);
  const onChange = useCallback((text: string) => {
    debounced(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: allImages } = useGetAllImages(project_id as string, { enabled: type === "images", staleTime: 5 * 60 * 1000 });

  if (isFetching) return <ProgressSpinner />;

  return (
    <div className="flex max-w-md flex-col">
      <div className="mb-2">
        <InputText className="p-inputtext-sm mb-2 w-full" onChange={(e) => onChange(e.target.value)} placeholder="Search..." />
      </div>
      {type === "documents" ? (
        <FolderViewCards
          items={
            documents?.filter(
              (doc) => !doc.folder && !doc.template && (search ? doc.title.toLowerCase().includes(search.toLowerCase()) : true),
            ) || []
          }
          type="documents"
        />
      ) : (
        <div className="flex w-full flex-wrap justify-between gap-2 overflow-y-auto">
          {allImages
            ?.filter((image) => (search ? image.split("/").pop()?.toLowerCase().includes(search.toLowerCase()) : true))
            ?.map((image) => (
              <img
                key={image}
                alt={image}
                className="h-24 w-24 object-contain"
                loading="lazy"
                onDragStart={(e) => {
                  e.dataTransfer.setData("item_id", JSON.stringify({ image, type }));
                }}
                src={image}
                title={image}
              />
            ))}
        </div>
      )}
    </div>
  );
}
