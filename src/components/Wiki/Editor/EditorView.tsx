import { EditorComponent, useActive } from "@remirror/react";
import { useParams } from "react-router-dom";
import "remirror/styles/all.css";
import "../../../styles/Editor.css";
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
  const active = useActive();

  return doc_id ? (
    <>
      <MenuBar saving={saving} active={active} />
      <EditorComponent />
      <BubbleMenu />
      <MentionComponent />
    </>
  ) : null;
}
