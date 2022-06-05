import { EditorComponent, useRemirrorContext } from "@remirror/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "remirror/styles/all.css";
import "../../../styles/Editor.css";
import { useGetDocumentData } from "../../../utils/customHooks";
import { toastWarn } from "../../../utils/utils";
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
        setContent(currentDocument.content ?? "");
      } else {
        toastWarn("Document doesn't seem to exist.");
        navigate("../");
      }
    }
  }, [doc_id]);
  return doc_id ? (
    <>
      <MenuBar saving={saving} />
      <EditorComponent />
      <BubbleMenu />
      <MentionComponent />
    </>
  ) : null;
}
