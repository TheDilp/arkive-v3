import { TableExtension } from "@remirror/extension-react-tables";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
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
import { useGetDocumentData } from "../../../utils/customHooks";
import "../../../styles/Editor.css";
import CustomLinkExtenstion from "../CustomLinkExtension";
import MentionReactComponent from "../MentionReactComponent";
import LinkHoverEditor from "./LinkHoverEditor";

export default function LinkHoverWindow({
  content,
}: {
  content: RemirrorJSON | null;
}) {
  const { project_id, doc_id } = useParams();
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );
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
        enableResizing: true,
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
    content: currentDocument?.content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  if (!currentDocument) return <Navigate to="../../wiki" />;
  return (
    <div className="editorContainer w-full h-20rem ">
      <ThemeProvider>
        <Remirror
          manager={manager}
          initialContent={state}
          classNames={["text-white Lato Editor w-full h-20rem"]}
          editable={false}
        >
          <LinkHoverEditor content={content} />
        </Remirror>
      </ThemeProvider>
    </div>
  );
}
