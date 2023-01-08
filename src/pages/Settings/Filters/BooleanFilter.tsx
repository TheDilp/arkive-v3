import { Checkbox } from "primereact/checkbox";
import { ColumnFilterElementTemplateOptions } from "primereact/column";

export default function BooleanFilter(options: ColumnFilterElementTemplateOptions) {
  const { value, filterCallback } = options;
  return (
    <div className="flex w-full justify-evenly">
      <Checkbox
        checked={value}
        className="p-column-filter"
        onChange={(e) => {
          filterCallback(e.checked);
        }}
        placeholder="False"
      />
    </div>
  );
}
