import {
  Callout,
  createLinkHandler,
  Doc,
  Heading,
  MarkMap,
  PlaceholderExtension,
  TextHandler,
  useHelpers,
  useKeymap,
} from "@remirror/react";
import { saveAs } from "file-saver";
import { ComponentType, useCallback } from "react";
import { useParams } from "react-router-dom";
import { EditorState, prosemirrorNodeToHtml } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  DropCursorExtension,
  GapCursorExtension,
  HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  LinkExtension,
  MarkdownExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  TaskListExtension,
  UnderlineExtension,
} from "remirror/extensions";

import MentionReactComponent from "../components/Mention/MentionReactComponent";
import { useUpdateItem } from "../CRUD/ItemsCRUD";
import { useGetItem } from "../hooks/useGetItem";
import { DocumentType } from "../types/documentTypes";
import { toaster } from "./toast";

export const DefaultEditorExtensions = () => {
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        char: "@",
        name: "at",
      },
      {
        name: "hash",
        char: "#",
      },
      // {
      //   name: "dollah",
      //   char: "$",
      //   appendText: "",
      // },
    ],
  });
  CustomMentionExtension.ReactComponent = MentionReactComponent;

  return [
    new PlaceholderExtension({
      placeholder: "Write something awesome! 📜",
    }),
    CustomMentionExtension,
    new BoldExtension({}),
    new ItalicExtension({}),
    new HeadingExtension({}),
    new UnderlineExtension({}),
    new BlockquoteExtension({}),
    new BulletListExtension({
      enableSpine: false,
    }),
    new TaskListExtension({}),
    new OrderedListExtension({}),
    new LinkExtension({
      autoLink: true,
      defaultTarget: "_blank",
      selectTextOnClick: true,
    }),
    new ImageExtension({
      enableResizing: true,
    }),
    new HorizontalRuleExtension({}),
    new CalloutExtension({}),
    new NodeFormattingExtension({}),
    new HardBreakExtension({}),
    new MarkdownExtension({}),
    CustomMentionExtension,
    //   new SecretExtension({
    //     extraAttributes: {
    //       class: "secretBlock",
    //     },
    //     secret: "true",
    //     classNames: "secretBlock",
    //   }),
    //   new MapPreviewExtension({
    // public_view: false,
    // type: null,
    //   }),
    new GapCursorExtension({}),
    new DropCursorExtension({}),
  ];
};
export type TestMap = Partial<Record<string, string | ComponentType<any>>>;

export const typeMap: MarkMap = {
  blockquote: "blockquote",
  bulletList: (props) => {
    return <div>{props.children}</div>;
  },
  callout: Callout,
  doc: Doc,
  hardBreak: "br",
  heading: Heading,
  horizontalRule: "hr",
  image: "img",
  listItem: "li",
  mentionAtom: (props) => {
    return <MentionReactComponent {...props.node.attrs} disableTooltip />;
  },
  orderedList: "ol",
  paragraph: "p",
  text: TextHandler,
};

export const markMap: MarkMap = {
  bold: "strong",
  code: "code",
  italic: "em",
  link: createLinkHandler({ target: "_blank" }),
  underline: "u",
};

export const editorHooks = [
  () => {
    const { getJSON, getText } = useHelpers();
    const { item_id } = useParams();
    const saveContentMutation = useUpdateItem("documents");
    const { data: document } = useGetItem(item_id as string, "documents") as { data: DocumentType };
    const handleSaveShortcut = useCallback(
      ({ state }: { state: EditorState }) => {
        toaster("success", "Document successfully saved!");
        saveContentMutation.mutate({
          id: item_id as string,
          content: getJSON(state),
        });
        return true; // Prevents any further key handlers from being run.
      },
      [getJSON, item_id],
    );
    const handleExportShortcut = useCallback(
      ({ state }: { state: EditorState }) => {
        const htmlString = prosemirrorNodeToHtml(state.doc);
        saveAs(
          new Blob([htmlString], {
            type: "text/html;charset=utf-8",
          }),
          `${document?.title || `Arkive Document - ${item_id}`}.html`,
        );
        return true; // Prevents any further key handlers from being run.
      },
      [getText, item_id],
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS

    useKeymap("Mod-s", handleSaveShortcut);
    useKeymap("Mod-e", handleExportShortcut);
  },
];
