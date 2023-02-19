import { QueryClient } from "@tanstack/react-query";
import { ColumnEditorOptions } from "primereact/column";

import { AllItemsType, AvailableItemTypes } from "../../../types/generalTypes";
import Tags from "../../Tags/Tags";

export default function TagsEditor({
  editorOptions,
  type,
  queryClient,
  project_id,
}: {
  editorOptions: ColumnEditorOptions;
  type: AvailableItemTypes;
  queryClient: QueryClient;
  project_id: string;
}) {
  const { rowData, editorCallback } = editorOptions;

  return (
    <Tags
      handleChange={({ value }) => {
        queryClient.setQueryData<AllItemsType[]>(["allItems", project_id, type], (oldData) => {
          if (oldData) {
            return oldData.map((item) => {
              if (item.id === rowData.id) {
                return { ...item, tags: value };
              }
              return item;
            });
          }

          return oldData;
        });
        if (editorCallback) editorCallback(value);
      }}
      isSettings
      localItem={rowData}
      type={type}
    />
  );
}
