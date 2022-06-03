import { EditorComponent, useRemirrorContext } from "@remirror/react";
import "remirror/styles/all.css";
import "../../../styles/Editor.css";
import { BubbleMenu } from "./BubbleMenu/BubbleMenu";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";
type Props = {};

export default function EditorView({}: Props) {
  const { active } = useRemirrorContext();

  return (
    <>
      <MenuBar saving={false} active={active} />
      <EditorComponent />
      <BubbleMenu />
      <MentionComponent />
    </>
  );
}
