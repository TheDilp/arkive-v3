import { ColumnFilterElementTemplateOptions } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";

import { TagType } from "../../../types/generalTypes";

export default function TagsFilter(options: ColumnFilterElementTemplateOptions, tags: TagType[]) {
  const { filterCallback, value } = options;
  return (
    <MultiSelect
      className="p-column-filter w-full"
      display="chip"
      filter
      filterBy="title"
      onChange={(e) => filterCallback(e.value)}
      optionLabel="title"
      options={tags}
      placeholder="Any"
      value={value}
    />
  );
}
