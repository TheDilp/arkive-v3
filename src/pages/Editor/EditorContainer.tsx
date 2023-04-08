import { Remirror, useRemirror } from "@remirror/react";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { InvalidContentHandler, RemirrorJSON } from "remirror";
import { useDebouncedCallback } from "use-debounce";

import { useUpdateItem } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { DefaultEditorExtensions, editorHooks } from "../../utils/editorUtils";

export default function EditorContainer({
  children,
  document,
  provider,
}: {
  document: DocumentType;
  children: JSX.Element | JSX.Element[] | null;
  provider: any;
}) {
  const { project_id } = useParams();
  const { mutate: updateDocumentMutation } = useUpdateItem<DocumentType>("documents", project_id as string);

  const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
    // Automatically remove all invalid nodes and marks.
    return transformers.remove(json, invalidContent);
  }, []);

  const { manager, state, setState } = useRemirror({
    content: !document?.content ? undefined : (document && document?.content) || undefined,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    extensions: DefaultEditorExtensions(provider),
    selection: "start",
    onError,
  });

  const debounced = useDebouncedCallback((changedContent: RemirrorJSON, id: string) => {
    updateDocumentMutation({
      content: changedContent,
      id,
    });
  }, 1250);
  const onChange = useCallback((changedContent: RemirrorJSON, doc_id: string) => {
    debounced(changedContent, doc_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Remirror
      classNames={["editor", "w-full", "flex-1", "font-Lato", "h-[calc(100vh-10rem)] overflow-y-auto"]}
      editable
      hooks={editorHooks}
      manager={manager}
      onChange={(params) => {
        if (params.firstRender) {
          return;
        }
        setState(params.state);
        onChange(params.state.doc.toJSON(), document.id);
      }}
      state={state}>
      {children}
    </Remirror>
  );
}
