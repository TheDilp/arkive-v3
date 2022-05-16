import { EditorComponent, useRemirrorContext } from "@remirror/react";
import { useEffect } from "react";
import { RemirrorJSON } from "remirror";
import "remirror/styles/all.css";
import "../../../styles/Editor.css";
type Props = {
  content: RemirrorJSON | null;
};

export default function LinkHoverEditor({ content }: Props) {
  const { setContent } = useRemirrorContext();
  useEffect(() => {
    //   The custom mention react component does not load unless a minimal timeout is set
    setTimeout(() => {
      setContent(content ?? "");
    }, 1);
  }, []);
  return content ? (
    <>
      <EditorComponent />
    </>
  ) : null;
}
