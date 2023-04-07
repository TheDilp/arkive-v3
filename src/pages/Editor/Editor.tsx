import "remirror/styles/all.css";

import { EditorComponent, OnChangeJSON, Remirror, useRemirror } from "@remirror/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import { InvalidContentHandler, RemirrorJSON } from "remirror";
import { useDebouncedCallback } from "use-debounce";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { CommandMenu } from "../../components/Editor/CommandMenu";
import Menubar from "../../components/Editor/Menubar";
import MentionDropdownComponent from "../../components/Mention/MentionDropdownComponent";
import { useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { EditorType } from "../../types/generalTypes";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { OtherContextMenuAtom } from "../../utils/Atoms/atoms";
import { useEditorMenuItems } from "../../utils/contextMenus";
import { DefaultEditorExtensions, editorHooks } from "../../utils/editorUtils";
import { toaster } from "../../utils/toast";

export default function Editor({ content, editable }: EditorType) {
  const { project_id, item_id } = useParams();

  const { data: currentDocument, isLoading } = useGetItem<DocumentType>(item_id as string, "documents", {
    enabled: !!editable && !!item_id,
    staleTime: 5 * 60 * 1000,
  });
  const queryClient = useQueryClient();
  const setMention = useSetAtom(OtherContextMenuAtom);
  const cm = useRef() as MutableRefObject<any>;
  const updateDocumentMutation = useUpdateItem<DocumentType>("documents", project_id as string);

  const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
    // Automatically remove all invalid nodes and marks.
    return transformers.remove(json, invalidContent);
  }, []);

  const { manager, state, getContext } = useRemirror({
    content: editable === false ? content || undefined : (currentDocument && currentDocument?.content) || undefined,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    extensions: DefaultEditorExtensions(),
    selection: "start",
    onError,
  });
  const debounced = useDebouncedCallback((changedContent: RemirrorJSON, id: string) => {
    updateDocumentMutation?.mutate({
      content: changedContent,
      id,
    });
  }, 1250);
  const onChange = useCallback((changedContent: RemirrorJSON, doc_id: string) => {
    debounced(changedContent, doc_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const items = useEditorMenuItems();

  useEffect(() => {
    setMention((prev) => ({ ...prev, cm }));
  }, [cm, setMention]);

  useEffect(() => {
    if (currentDocument)
      manager.view.updateState(
        manager.createState({
          selection: getContext()?.getState().selection,
          content:
            editable === false ? content || undefined : ("content" in currentDocument && currentDocument?.content) || undefined,
        }),
      );
  }, [currentDocument, item_id]);

  useEffect(() => {
    return () => {
      queryClient.refetchQueries({ queryKey: ["documents", item_id] });
    };
  }, [item_id]);

  if (!currentDocument && !isLoading) {
    toaster("warning", "That document doesn't exist.");
    return <Navigate to="../" />;
  }

  return (
    <div className="flex w-full flex-1">
      <ContextMenu cm={cm} items={items} />
      <div
        className={`${editable ? "" : "h-96"}  relative flex w-full flex-col content-start`}
        onContextMenu={(e) => {
          setMention({ cm, data: getContext(), show: false });
          if (cm.current) cm.current.show(e);
        }}
        onDrop={(e) => {
          const stringData = e.dataTransfer.getData("Text");
          if (!stringData) return;
          if (stringData) {
            const data: { index: number; title: string; description?: string } = JSON.parse(e.dataTransfer.getData("Text"));
            if (!data) return;
            getContext()?.commands.insertText(`${data.title}: ${data?.description}`);
          }
        }}>
        {editable ? <Breadcrumbs type="documents" /> : null}
        {!isLoading ? (
          <Remirror
            classNames={[
              "editor",
              "w-full",
              "flex-1",
              "font-Lato",
              `${editable ? "h-[calc(100vh-10rem)] overflow-y-auto" : "h-full"}`,
            ]}
            editable={editable || true}
            hooks={editorHooks}
            initialContent={state}
            manager={manager}>
            {editable ? <Menubar /> : null}
            <OnChangeJSON
              onChange={(changedContent: RemirrorJSON) => {
                onChange(changedContent, item_id as string);
              }}
            />
            <EditorComponent />
            <MentionDropdownComponent />
            <CommandMenu />
          </Remirror>
        ) : (
          <ProgressSpinner />
        )}
      </div>
    </div>
  );
}
