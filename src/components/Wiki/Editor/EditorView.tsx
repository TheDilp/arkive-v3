import {
  EditorComponent, useActive
} from "@remirror/react";
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
  const { doc_id } = useParams();
  const active = useActive();
  // const test = useRemirrorContext();

  // const { getState } = useRemirrorContext();

  // useEffect(() => {
  //   let fromNode = test.manager.view.coordsAtPos(getState().selection.from);
  //   awareness.setLocalStateField("cursor", {
  //     from: getState().selection.from,
  //     to: getState().selection.to,
  //     top: fromNode.top,
  //     left: fromNode.left,
  //     color: "#ff0000",
  //   });
  // }, [getState().selection.from, getState().selection.to]);
  return doc_id ? (
    <>
      <MenuBar saving={saving} active={active} />
      <EditorComponent />
      <BubbleMenu />
      <MentionComponent />
    </>
  ) : null;
}
