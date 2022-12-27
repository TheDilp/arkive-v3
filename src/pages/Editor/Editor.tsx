import "remirror/styles/all.css";

import { Icon } from "@iconify/react";
import { EditorComponent, OnChangeJSON, Remirror, useRemirror } from "@remirror/react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { InvalidContentHandler, RemirrorJSON } from "remirror";
import { useDebouncedCallback } from "use-debounce";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Menubar from "../../components/Editor/Menubar";
import MentionDropdownComponent from "../../components/Mention/MentionDropdownComponent";
import DocumentProperties from "../../components/PropertiesBar/DocumentProperties";
import { useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { DocumentType } from "../../types/documentTypes";
import { EditorType } from "../../types/generalTypes";
import { DefaultEditorExtensions } from "../../utils/editorUtils";
import { toaster } from "../../utils/toast";

export default function Editor({ content, editable }: EditorType) {
  const { item_id } = useParams();
  const { data: currentDocument, isLoading } = useGetItem(item_id as string, "documents", { enabled: !!editable }) as {
    data: DocumentType;
    isLoading: boolean;
  };
  const updateDocumentMutation = useUpdateItem("documents");

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
    updateDocumentMutation?.mutate({
      content: changedContent,
      id,
    });
  }, 850);
  const onChange = useCallback((changedContent: RemirrorJSON, doc_id: string) => {
    debounced(changedContent, doc_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentDocument) {
      console.log("TEST");
      manager.view.updateState(
        manager.createState({
          content:
            editable === false ? content || undefined : ("content" in currentDocument && currentDocument?.content) || undefined,
        }),
      );
    }
  }, [currentDocument, item_id]);

  if (isLoading) return <ProgressSpinner />;

  if (!currentDocument && !isLoading) {
    toaster("warning", "That document doesn't exist.");
    return <Navigate to="../" />;
  }

  if (currentDocument)
    return (
      <div className="flex w-full flex-1">
        <div className={`${editable ? "w-5/6" : "h-96 w-full"} relative flex flex-col content-start`}>
          {editable ? (
            <h1 className=" sticky top-0 z-20 mb-0 flex h-12 w-full items-center justify-center border-b-2 border-zinc-700 bg-[#1e1e1e] pr-20 font-Merriweather text-2xl">
              <Icon className="mr-2" fontSize={30} icon={currentDocument.icon} />
              {currentDocument.title}
              {currentDocument?.template ? "[TEMPLATE]" : ""}
            </h1>
          ) : null}
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
            initialContent={state}
            manager={manager}>
            <OnChangeJSON
              onChange={(changedContent: RemirrorJSON) => {
                onChange(changedContent, item_id as string);
              }}
            />
            {editable ? <Menubar saving={false} /> : null}
            <EditorComponent />
            <MentionDropdownComponent />
          </Remirror>
        </div>
        {editable ? (
          <div className="flex w-1/6 flex-col bg-zinc-800">
            <DocumentProperties />
          </div>
        ) : null}
      </div>
    );

  return null;
}
