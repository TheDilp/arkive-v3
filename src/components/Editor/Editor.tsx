import { Icon } from "@iconify/react";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetItem } from "../../hooks/getItemHook";

type Props = {};

export default function Editor({}: Props) {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(
    project_id as string,
    item_id as string,
    "documents"
  );
  if (!currentDocument) return null;
  return (
    <div className="w-full flex-grow-1">
      <h1 className="w-full mt-2 mb-0 text-4xl flex justify-content-center Merriweather">
        <Icon className="mr-2" fontSize={40} icon={currentDocument.icon} />
        {currentDocument.title}
        {currentDocument.template ? "[TEMPLATE]" : ""}
      </h1>
    </div>
  );
}
