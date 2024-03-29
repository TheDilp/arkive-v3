import { ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";

export function TitleEditor(editorOptions: ColumnEditorOptions, updateItem: <T>(data: Partial<T>) => void) {
  const { rowData, editorCallback } = editorOptions;
  return (
    <InputText
      onChange={(e) => {
        if (rowData.id && e.currentTarget.value && editorCallback) editorCallback(e.currentTarget.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateItem({ id: rowData.id, title: e.currentTarget.value });
        }
      }}
      value={rowData.title}
    />
  );
}
