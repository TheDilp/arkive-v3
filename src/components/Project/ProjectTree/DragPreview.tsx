import React from "react";

type Props = {
  text: string;
  droppable?: boolean;
};

export default function DragPreview({ text, droppable }: Props) {
  return (
    <div className="bg-blue-800 Lato relative w-10rem h-1rem py-3 border-round flex justify-content-center align-items-center">
      <i className={`pi pi-fw ${droppable ? "pi-folder" : "pi-file"}`}></i>{" "}
      {text}
    </div>
  );
}
