import "remirror/styles/all.css";

import { EditorComponent, useRemirrorContext } from "@remirror/react";
import { useSetAtom } from "jotai";
import { ProgressSpinner } from "primereact/progressspinner";
import { MutableRefObject, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { CommandMenu } from "../../components/Editor/CommandMenu";
import MentionDropdownComponent from "../../components/Mention/MentionDropdownComponent";
import { useGetItem } from "../../hooks/useGetItem";
import { EditorType } from "../../types/generalTypes";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { OtherContextMenuAtom } from "../../utils/Atoms/atoms";
import { useEditorMenuItems } from "../../utils/contextMenus";
import { toaster } from "../../utils/toast";

export default function Editor({ editable }: EditorType) {
  const { item_id } = useParams();

  const { data: currentDocument, isLoading } = useGetItem<DocumentType>(item_id as string, "documents", {
    enabled: !!editable && !!item_id,
    staleTime: 5 * 60 * 1000,
  });
  const setMention = useSetAtom(OtherContextMenuAtom);
  const cm = useRef() as MutableRefObject<any>;

  const { commands } = useRemirrorContext();

  const items = useEditorMenuItems();

  useEffect(() => {
    setMention((prev) => ({ ...prev, cm }));
  }, [cm, setMention]);

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
          setMention({ cm, data: { commands }, show: false });
          if (cm.current) cm.current.show(e);
        }}
        onDrop={(e) => {
          const stringData = e.dataTransfer.getData("Text");
          if (!stringData) return;
          if (stringData) {
            const data: { index: number; title: string; description?: string } = JSON.parse(e.dataTransfer.getData("Text"));
            if (!data) return;
            commands.insertText(`${data.title}: ${data?.description}`);
          }
        }}>
        {editable ? <Breadcrumbs type="documents" /> : null}
        {!isLoading ? (
          <>
            <EditorComponent />
            <MentionDropdownComponent />
            <CommandMenu />
          </>
        ) : (
          <ProgressSpinner />
        )}
      </div>
    </div>
  );
}
