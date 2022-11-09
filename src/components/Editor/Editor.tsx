import { Icon } from "@iconify/react";
import { Remirror, useRemirror } from "@remirror/react";
import { Navigate, useParams } from "react-router-dom";
import { useGetItem } from "../../hooks/getItemHook";
import { DefaultEditorExtensions } from "../../utils/EditorExtensions";
import "remirror/styles/all.css";
type Props = {};

export default function Editor({}: Props) {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(
    project_id as string,
    item_id as string,
    "documents"
  );

  const { manager, state } = useRemirror({
    // @ts-ignore
    extensions: DefaultEditorExtensions(),
    selection: "start",
  });

  if (!currentDocument) return <Navigate to="../" />;
  return (
    <div className="w-full h-full flex flex-col content-start flex-1">
      <h1 className="w-full flex justify-center mt-2 mb-0 text-4xl h-min font-Merriweather">
        <Icon className="mr-2" fontSize={40} icon={currentDocument.icon} />
        {currentDocument.title}
        {currentDocument.template ? "[TEMPLATE]" : ""}
      </h1>
      <div className="w-full flex flex-1">
        <div className="w-5/6 flex flex-col">
          <Remirror
            classNames={["editor", "w-full", "bg-gray-700"]}
            manager={manager}
            initialContent={state}
          />
        </div>
        <div className="w-1/6 flex flex-col bg-gray-600"></div>
      </div>
    </div>
  );
}
