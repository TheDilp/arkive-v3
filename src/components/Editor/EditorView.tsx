import { EditorComponent, useRemirrorContext } from "@remirror/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RemirrorManager } from "remirror";
import "remirror/styles/all.css";
import "../../styles/Editor.css";
import {
  useGetDocumentData,
  useGetDocuments,
  useGetMaps,
} from "../../utils/customHooks";
import { toastWarn } from "../../utils/utils";
import { BubbleMenu } from "./BubbleMenu/BubbleMenu";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";
type Props = {
  saving: boolean | number;
  setSaving: (saving: boolean | number) => void;
  firstRender: any;
};

export default function EditorView({ saving, setSaving, firstRender }: Props) {
  const { project_id, doc_id } = useParams();
  const { setContent } = useRemirrorContext();
  const navigate = useNavigate();

  const documents = useGetDocuments(project_id as string);
  const maps = useGetMaps(project_id as string);
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );
  useEffect(() => {
    if (firstRender.current) {
      setSaving(false);
      firstRender.current = false;
    }
    if (doc_id) {
      if (currentDocument) {
        setTimeout(() => {
          setContent(currentDocument.content ?? "");
        }, 1);
      } else {
        navigate("../");
        toastWarn("Document doesn't seem to exist.");
      }
    }
  }, [doc_id]);
  return (
    <>
      <MenuBar saving={saving} />
      <EditorComponent />
      <BubbleMenu />
      <MentionComponent
        documents={documents.data?.filter((doc) => !doc.template) || []}
        maps={maps.data?.filter((map) => !map.folder) || []}
      />
    </>
  );
}
