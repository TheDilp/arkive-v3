import { Icon } from "@iconify/react";
import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  useRemirror,
} from "@remirror/react";
import { useCallback } from "react";
import { Navigate, useParams } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import "remirror/styles/all.css";
import { useDebouncedCallback } from "use-debounce";
import { useGetItem } from "../../hooks/getItemHook";
import { DefaultEditorExtensions } from "../../utils/EditorExtensions";

export default function Editor() {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(
    project_id as string,
    item_id as string,
    "documents",
  );

  const { manager, state } = useRemirror({
    // @ts-ignore
    extensions: DefaultEditorExtensions(),
    selection: "start",
  });

  const debounced = useDebouncedCallback(
    (content: RemirrorJSON, doc_id: string) => {
      console.log(content);
      // saveContentMutation.mutate({
      //   id: doc_id,
      //   // @ts-ignore
      //   content,
      // });
    },
    // delay in ms
    850,
  );

  const onChange = useCallback((content: RemirrorJSON, doc_id: string) => {
    debounced(content, doc_id);
  }, []);

  if (!currentDocument) return <Navigate to="../" />;
  return (
    <div className="w-full h-full flex flex-col content-start flex-1">
      <h1 className="w-full h-10 flex items-center justify-center mb-0 text-3xl border-b font-Merriweather border-zinc-700">
        <Icon className="mr-2" fontSize={30} icon={currentDocument.icon} />
        {currentDocument.title}
        {currentDocument.template ? "[TEMPLATE]" : ""}
      </h1>
      <div className="w-full flex flex-1">
        <div className="w-5/6 flex flex-col flex-1">
          <Remirror
            classNames={["editor", "w-full", "h-full", "font-Lato"]}
            manager={manager}
            initialContent={state}>
            <OnChangeJSON
              onChange={(content: RemirrorJSON) => {
                onChange(content, item_id as string);
              }}
            />
            <EditorComponent />
          </Remirror>
        </div>
        <div className="w-1/6 flex flex-col bg-zinc-800"></div>
      </div>
    </div>
  );
}
