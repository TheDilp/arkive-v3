import { ColumnFilterElementTemplateOptions } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";

import { boardNodeShapes } from "../../../utils/boardUtils";

export default function DefaultNodeFilter(options: ColumnFilterElementTemplateOptions) {
  const { filterCallback, value } = options;
  return (
    <MultiSelect
      className="p-column-filter w-full"
      display="chip"
      filter
      onChange={(e) => filterCallback(e.value)}
      options={boardNodeShapes}
      placeholder="Any"
      value={value}
    />
  );
}
