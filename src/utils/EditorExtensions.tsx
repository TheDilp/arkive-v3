import { PlaceholderExtension } from "@remirror/react";
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

export const DefaultEditorExtensions = () => {
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        name: "at",
        char: "@",
        appendText: "",
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
    new NodeFormattingExtension(),
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
