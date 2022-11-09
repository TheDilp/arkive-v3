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
  NodeFormattingExtension,
  OrderedListExtension,
  TaskListExtension,
  UnderlineExtension,
} from "remirror/extensions";

export const DefaultEditorExtensions = [
  new PlaceholderExtension({
    placeholder: "Write something awesome! 📜",
  }),
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
