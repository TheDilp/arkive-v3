import { Icon } from "@iconify/react";
import { Remirror, useRemirror } from "@remirror/react";
import { useParams } from "react-router-dom";
import { useGetItem } from "../../hooks/getItemHook";
import { DefaultEditorExtensions } from "../../utils/EditorExtensions";
type Props = {};

export default function Editor({}: Props) {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(
    project_id as string,
    item_id as string,
    "documents"
  );

  const { manager, state } = useRemirror({
    extensions: () => DefaultEditorExtensions,
    selection: "start",
  });

  if (!currentDocument) return null;
  return (
    <div className="w-full flex  flex-grow-1">
      <h1 className="w-full mt-2 mb-0 text-4xl flex justify-content-center Merriweather">
        <Icon className="mr-2" fontSize={40} icon={currentDocument.icon} />
        {currentDocument.title}
        {currentDocument.template ? "[TEMPLATE]" : ""}
      </h1>

      {/* 12 is full width; take up 10 and 2 of current container*/}
      <div className="w-10">
        <Remirror
          classNames={["editor", "bg-gray-700"]}
          manager={manager}
          initialContent={state}
        />
      </div>
      <div className="w-2"></div>
    </div>
  );
}
