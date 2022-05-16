import { TableExtension } from "@remirror/extension-react-tables";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { useMemo } from "react";
import { htmlToProsemirrorNode, RemirrorJSON } from "remirror";
import {
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
import "../../../styles/Editor.css";
import CustomLinkExtenstion from "../CustomLinkExtension";
import MentionReactComponent from "../MentionReactComponent/MentionReactComponent";
import LinkHoverEditor from "./LinkHoverEditor";

export default function LinkHoverWindow({
  content,
}: {
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
      new ItalicExtension(),
      new HeadingExtension(),
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
    ],
    selection: "all",
    content: content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  return (
    <div className="editorContainer w-full h-20rem ">
      <ThemeProvider>
        <Remirror
          manager={manager}
          initialContent={state}
          classNames={["text-white Lato viewOnlyEditor w-full h-20rem"]}
          editable={false}
        >
          <LinkHoverEditor content={content} />
        </Remirror>
      </ThemeProvider>
    </div>
  );
}
