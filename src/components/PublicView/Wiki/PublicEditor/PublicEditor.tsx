import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode, RemirrorJSON } from "remirror";
import { MentionAtomExtension } from "remirror/extensions";
import "remirror/styles/all.css";
import "../../../../styles/Editor.css";
import { editorExtensions } from "../../../../utils/utils";
import MentionReactComponent from "./MentionReactComponent/PublicMentionReactComponent";
import PublicEditorComponent from "./PublicEditorComponent";

export default function PublicEditor({
  content,
  classes,
}: {
  content: RemirrorJSON | null;
  classes?: string;
}) {
  // ======================================================
  // REMIRROR SETUP
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        name: "at",
        char: "@",
        appendText: "",
      },
      {
        name: "hash",
        char: "#",
        appendText: "",
      },
      {
        name: "dollah",
        char: "$",
        appendText: "",
      },
    ],
  });
  CustomMentionExtension.ReactComponent = MentionReactComponent;

  const { manager, state } = useRemirror({
    extensions: () => [...editorExtensions, CustomMentionExtension],
    selection: "all",
    content: content || undefined,
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  return (
    <div className={`editorContainer w-full ${classes || "h-20rem"} `}>
      {content ? (
        <ThemeProvider>
          <Remirror
            manager={manager}
            initialContent={state}
            classNames={[
              `text-white Lato viewOnlyEditor w-full ${classes || "h-20rem"}`,
            ]}
            editable={false}
          >
            <PublicEditorComponent content={content} />
          </Remirror>
        </ThemeProvider>
      ) : null}
    </div>
  );
}
