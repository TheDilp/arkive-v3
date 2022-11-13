import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { useMemo } from "react";
import { htmlToProsemirrorNode, RemirrorJSON } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  ColumnsExtension,
  HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  LinkExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  TaskListExtension,
  UnderlineExtension, TableExtension
} from "remirror/extensions";
import "remirror/styles/all.css";
import "../../../../../../styles/Editor.css";
import { MapPreviewExtension } from "../../CustomPreviews/MapPreviewExtension";
import { SecretExtension } from "../../SecretExtension/SecretExtension";
import MentionReactComponent from "../MentionReactComponent/MentionReactComponent";
import LinkHoverEditor from "./MentionHoverEditor";

export default function LinkHoverWindow({
  content,
  classes,
}: {
  classes?: string;
  content: RemirrorJSON | null;
}) {
  // ======================================================
  // REMIRROR SETUP
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        name: "at",
        char: "@",
        appendText: "",
        supportedCharacters: /[^\s][\w\d_ ]+/,
      },
      {
        name: "hash",
        char: "#",
        appendText: "",
        supportedCharacters: /[^\s][\w\d_ ]+/,
      },
      {
        name: "dollah",
        char: "$",
        appendText: "",
        supportedCharacters: /[^\s][\w\d_ ]+/,
      },
    ],
  });
  CustomMentionExtension.ReactComponent = useMemo(
    () => MentionReactComponent,
    []
  );

  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ColumnsExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new UnderlineExtension(),
      new BlockquoteExtension(),
      new BulletListExtension(),
      new TaskListExtension(),
      new OrderedListExtension(),
      new LinkExtension({
        autoLink: true,
        defaultTarget: "_blank",
        selectTextOnClick: true
      }),
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
        public_view: false,
        type: null,
      }),
      new TableExtension(),
    ],
    selection: "all",
    content: content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  return (
    <div className={`editorContainer w-full ${classes || "h-20rem"}`} style={{ zIndex: 999 }}>
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
            <LinkHoverEditor content={content} />
          </Remirror>
        </ThemeProvider>
      ) : null}
    </div>
  );
}
