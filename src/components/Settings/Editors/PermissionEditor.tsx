import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutateAsyncFunction } from "@tanstack/react-query";
import { ColumnEditorOptions } from "primereact/column";
import { Dropdown } from "primereact/dropdown";

import { PermissionLevelType } from "../../../types/generalTypes";
import { ProjectType } from "../../../types/ItemTypes/projectTypes";
import { DefaultPermissions } from "../../../utils/DefaultValues/ProjectDefaults";

export function PermissionEditor(
  editorOptions: ColumnEditorOptions,
  user_id: string,
  updateItem: UseMutateAsyncFunction<
    any,
    unknown,
    {
      id: string;
      user_id: string;
      permission: {
        name: string;
        value: PermissionLevelType;
      };
    },
    {
      oldData: unknown;
    }
  >,
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<ProjectType, unknown>>,
) {
  const { rowData, editorCallback, field } = editorOptions;
  return (
    <Dropdown
      onChange={async (e) => {
        if (editorCallback) {
          await updateItem({ id: rowData.permissions[0].id, user_id, permission: { name: field, value: e.value } });
          await refetch();
          editorCallback(e.value);
        }
      }}
      options={DefaultPermissions}
      value={rowData.permissions[0][field]}
    />
  );
}
