import "remirror/styles/all.css";

import { EditorComponent, OnChangeJSON, Remirror, useRemirror } from "@remirror/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { EditorType } from "../../types/generalTypes";
import { MentionContextAtom } from "../../utils/Atoms/atoms";
import { useMentionMenuItems } from "../../utils/contextMenus";
import { DefaultEditorExtensions, editorHooks } from "../../utils/editorUtils";
import { toaster } from "../../utils/toast";

export default function Editor({ content, editable }: EditorType) {
  const { project_id, item_id } = useParams();
  const [saving, setSaving] = useState(false);
  const { data: currentDocument, isLoading } = useGetItem(item_id as string, "documents", { enabled: !!editable }) as {
    data: DocumentType;
    isLoading: boolean;
  };
  const queryClient = useQueryClient();
  const cm = useRef();
  const [, setMention] = useAtom(MentionContextAtom);
  const updateDocumentMutation = useUpdateItem<DocumentType>("documents", project_id as string);

  const onError: InvalidContentHandler = useCallback(({ json, invalidContent, transformers }) => {
    // Automatically remove all invalid nodes and marks.
    return transformers.remove(json, invalidContent);
  }, []);

  const { manager, state } = useRemirror({
    content: editable === false ? content || undefined : (currentDocument && currentDocument?.content) || undefined,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    extensions: DefaultEditorExtensions(),
    selection: "start",
    onError,
  });

  const debounced = useDebouncedCallback((changedContent: RemirrorJSON, id: string) => {
    updateDocumentMutation?.mutate(
      {
        content: changedContent,
        id,
      },
      {
        onSuccess: () => setSaving(false),
      },
    );
  }, 1250);
  const onChange = useCallback((changedContent: RemirrorJSON, doc_id: string) => {
    debounced(changedContent, doc_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const items = useMentionMenuItems();

  useEffect(() => {
    setMention((prev) => ({ ...prev, cm }));
  }, [cm, setMention]);

  useEffect(() => {
    if (currentDocument)
      manager.view.updateState(
        manager.createState({
          content:
            editable === false ? content || undefined : ("content" in currentDocument && currentDocument?.content) || undefined,
        }),
      );

    return () => {
      queryClient.refetchQueries({ queryKey: ["documents", item_id] });
    };
  }, [currentDocument, item_id]);
  if (isLoading) return <ProgressSpinner />;

  if (!currentDocument && !isLoading) {
    toaster("warning", "That document doesn't exist.");
    return <Navigate to="../" />;
  }

  if (currentDocument)
    return (
      <div className="flex w-full flex-1">
        <ContextMenu cm={cm} items={items} />
        <div className={`${editable ? "" : "h-96"}  relative flex w-full flex-col content-start`}>
          {editable ? <Breadcrumbs type="documents" /> : null}
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
            <OnChangeJSON
              onChange={(changedContent: RemirrorJSON) => {
                onChange(changedContent, item_id as string);
                setSaving(true);
              }}
            />
            {editable ? <Menubar saving={saving} /> : null}
            <EditorComponent />
            <MentionDropdownComponent />
            <CommandMenu />
          </Remirror>
        </div>
      </div>
    );

  return null;
}
