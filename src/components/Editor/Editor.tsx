import { Icon } from "@iconify/react";
import { EditorComponent, OnChangeJSON, Remirror, useRemirror } from "@remirror/react";
import { useCallback, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import "remirror/styles/all.css";
import { useDebouncedCallback } from "use-debounce";
import { useUpdateMutation } from "../../CRUD/DocumentCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { EditorType } from "../../types/generalTypes";
import { DefaultEditorExtensions } from "../../utils/EditorExtensions";
import MentionDropdownComponent from "../Mention/MentionDropdownComponent";
import TagsAutocomplete from "../PropertiesBar/DocumentProperties";

export default function Editor({ content, editable }: EditorType) {
  const { project_id, item_id } = useParams();
  const currentDocument = useGetItem(project_id as string, item_id as string, "documents");
  const updateDocumentMutation = useUpdateMutation("documents");

  const { manager, state } = useRemirror({
    content: editable === false ? content || undefined : currentDocument?.content,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    extensions: DefaultEditorExtensions(),
    selection: "start",
  });

  const debounced = useDebouncedCallback((content: RemirrorJSON, id: string) => {
    updateDocumentMutation?.mutate({
      content,
      id,
    });
  }, 850);
  const onChange = useCallback((content: RemirrorJSON, doc_id: string) => {
    debounced(content, doc_id);
  }, []);

  useEffect(() => {
    if (currentDocument) {
      manager.view.updateState(
        manager.createState({
          content: editable === false ? content || undefined : currentDocument?.content || undefined,
        }),
      );
    }
  }, [item_id]);

  if (!currentDocument) return <Navigate to="../" />;
  return (
    <div className="h-full flex">
      <div className="w-5/6 h-full flex flex-col content-start flex-1">
        <h1 className="w-full h-10 flex items-center justify-center mb-0 pr-20 text-2xl border-b font-Merriweather border-zinc-700">
          <Icon className="mr-2" fontSize={30} icon={currentDocument.icon} />
          {currentDocument.title}
          {currentDocument.template ? "[TEMPLATE]" : ""}
        </h1>
        <div className="w-full flex flex-1">
          <div className="flex flex-col flex-1">
            <Remirror
              editable={editable || true}
              classNames={["editor", "w-full", "h-full", "font-Lato"]}
              manager={manager}
              initialContent={state}>
              <OnChangeJSON
                onChange={(content: RemirrorJSON) => {
                  onChange(content, item_id as string);
                }}
              />
              <EditorComponent />
              <MentionDropdownComponent />
            </Remirror>
          </div>
        </div>
      </div>
      <div className="w-1/6 flex flex-col bg-zinc-800">
        <TagsAutocomplete />
      </div>
    </div>
  );
}
