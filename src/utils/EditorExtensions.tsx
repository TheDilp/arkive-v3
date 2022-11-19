import { Callout, createLinkHandler, Doc, Heading, MarkMap, PlaceholderExtension, TextHandler } from "@remirror/react";
import { ComponentType, FC } from "react";
import { RemirrorJSON } from "remirror";
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
import DocumentMention from "../components/Mention/DocumentMention";
import MentionReactComponent from "../components/Mention/MentionReactComponent";

export const DefaultEditorExtensions = () => {
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        appendText: "",
        char: "@",
        name: "at",
      },
      // {
      //   name: "hash",
      //   char: "#",
      //   appendText: "",
      // },
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
    new BoldExtension(),
    new ItalicExtension(),
    new HeadingExtension(),
    new UnderlineExtension(),
    new BlockquoteExtension(),
    new BulletListExtension({
      enableSpine: false,
    }),
    new TaskListExtension(),
    new OrderedListExtension(),
    new LinkExtension({
      autoLink: true,
      defaultTarget: "_blank",
      selectTextOnClick: true,
    }),
    new ImageExtension({
      enableResizing: true,
    }),
    new HorizontalRuleExtension(),
    new CalloutExtension(),
    // new NodeFormattingExtension(),
    new HardBreakExtension(),
    new MarkdownExtension(),
    CustomMentionExtension,
    //   new SecretExtension({
    //     extraAttributes: {
    //       class: "secretBlock",
    //     },
    //     secret: "true",
    //     classNames: "secretBlock",
    //   }),
    //   CustomMentionExtension,
    //   new MapPreviewExtension({
    // public_view: false,
    // type: null,
    //   }),
    new GapCursorExtension(),
    new DropCursorExtension(),
    //   new TableExtension(),
  ];
};

export type TestMap = Partial<Record<string, string | ComponentType<any>>>;

export const typeMap: MarkMap = {
  blockquote: "blockquote",
  bulletList: (props) => {
    console.log(props);
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
    console.log(props);
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
