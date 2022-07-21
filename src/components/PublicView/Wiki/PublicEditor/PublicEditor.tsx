import { TableExtension } from "@remirror/extension-react-tables";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { useMemo } from "react";
import { htmlToProsemirrorNode, RemirrorJSON } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  MarkdownExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  TextColorExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import "../../../../styles/Editor.css";
import CustomLinkExtenstion from "../../../Wiki/Editor/CustomExtensions/CustomLink/CustomLinkExtension";
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
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new BlockquoteExtension(),
      new UnderlineExtension(),
      new ImageExtension({
        enableResizing: false,
      }),
      new BulletListExtension(),
      new OrderedListExtension(),
      CustomMentionExtension,
      CustomLinkExtenstion,
      new HorizontalRuleExtension(),
      new CalloutExtension(),
      new NodeFormattingExtension(),
      new TextColorExtension(),
      new MarkdownExtension(),
      new TableExtension(),
      new SecretExtension({
        secret: true,
      }),
    ],
    extraAttributes: [
      {
        identifiers: ["secret"],
        attributes: {
          class: "secretBlock",
        },
      },
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
