import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { ColumnEditorOptions } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

export const dataTableTextEditor = (options: ColumnEditorOptions) => {
  return (
    <InputText
      type="text"
      className="w-12rem"
      value={options.value}
      onChange={(e) => {
        if (options.editorCallback) options.editorCallback(e.target.value);
      }}
    />
  );
};
export const dataTableNumberEditor = (
  options: ColumnEditorOptions,
  min: number,
  max: number,
  step: number
) => {
  return (
    <InputNumber
      showButtons
      min={min}
      max={max}
      step={step}
      value={options.value}
      onChange={(e) => {
        if (options.editorCallback) options.editorCallback(e.value);
      }}
    />
  );
};

export const dataTableColorEditor = (options: ColumnEditorOptions) => {
  return (
    <div className="flex align-items-center justify-content-between w-full">
      <InputText
        className="w-6rem mr-2"
        value={options.value}
        onChange={(e) => {
          if (options.editorCallback) options.editorCallback(e.target.value);
        }}
      />
      <ColorPicker
        className="w-min"
        value={options.value}
        onChange={(e) => {
          if (options.editorCallback && e.value)
            options.editorCallback(
              "#" + e.value.toString().replaceAll("#", "")
            );
        }}
      />
      <Button
        className="p-button-rounded p-button-text ml-2"
        tooltip="Reset"
        icon="pi pi-undo"
        onClick={(e) => {
          if (options.editorCallback) options.editorCallback("#121212");
        }}
      />
    </div>
  );
};
