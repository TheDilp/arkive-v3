import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { htmlToProsemirrorNode, RemirrorJSON } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension, DropCursorExtension,
  GapCursorExtension, HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension, MentionAtomExtension, NodeFormattingExtension,
  OrderedListExtension,
  PlaceholderExtension,
  TaskListExtension,
  UnderlineExtension
} from "remirror/extensions";
import "remirror/styles/all.css";
import "../../../../styles/Editor.css";
import CustomLinkExtenstion from "../../../Wiki/Editor/CustomExtensions/CustomLink/CustomLinkExtension";
import { MapPreviewExtension } from "../../../Wiki/Editor/CustomExtensions/CustomPreviews/MapPreviewExtension";
import { SecretExtension } from "../../../Wiki/Editor/CustomExtensions/SecretExtension/SecretExtension";
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
    extensions: () => [
      new PlaceholderExtension({
        placeholder: "Write something awesome! 📜",
      }),
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new UnderlineExtension(),
      new BlockquoteExtension(),
      new BulletListExtension(),
      new TaskListExtension(),
      new OrderedListExtension(),
      CustomLinkExtenstion,
      new ImageExtension({
        enableResizing: true,
      }),
      new HorizontalRuleExtension(),
      new CalloutExtension(),
      new NodeFormattingExtension(),
      new HardBreakExtension(),
      new SecretExtension({
        extraAttributes: {
          class: "secretBlock",
        },
        secret: "true",
        classNames: "secretBlock",
      }),
      CustomMentionExtension,
      new MapPreviewExtension({
        public_view: true,
        type: null,
      }),
      new GapCursorExtension(),
      new DropCursorExtension(),
    ],
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
