import React from "react";
import { CustomColumnsAttributes } from "./CustomColumnsExtension";
import { InputTextarea } from "primereact/inputtextarea";
export default function CustomColumnsComponent({
  count,
}: CustomColumnsAttributes) {
  const columns = [];
  for (let index = 0; index < count; index++) {
    columns.push({
      id: index,
      name: index,
    });
  }
  return (
    <div className="bg-green-500 flex">
      {columns.map((col) => (
        <div className="bg-blue-400 w-6" key={col.id}>
          <InputTextarea />
        </div>
      ))}
    </div>
  );
}
