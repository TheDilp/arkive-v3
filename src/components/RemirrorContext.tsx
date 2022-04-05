import {
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  MentionAtomExtension,
  ImageExtension,
  BulletListExtension,
  OrderedListExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  CalloutExtension,
} from "remirror/extensions";
import {
  useRemirror,
  Remirror,
  EditorComponent,
  ThemeProvider,
  useHelpers,
  useKeymap,
} from "@remirror/react";
import "remirror/styles/all.css";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";
import CustomLinkExtenstion from "./CustomLinkExtension";
import { useCallback, useEffect, useState } from "react";

const hooks = [
  () => {
    const { getJSON } = useHelpers();

    const handleSaveShortcut = useCallback(
      ({ state }) => {
        localStorage.setItem("content", JSON.stringify(getJSON(state)));

        return true; // Prevents any further key handlers from being run.
      },
      [getJSON]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
  },
];

export default function RemirrorContext() {
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
      new MentionAtomExtension({
        extraTags: ["link"],
        extraAttributes: { href: "" },
        mentionTag: "a",
        matchers: [
          {
            name: "at",
            char: "@",
            appendText: "",
          },
        ],
      }),
      CustomLinkExtenstion,
      new HorizontalRuleExtension(),
      new CalloutExtension(),
    ],

    // Set the initial content.
    content: "<p>This is awesome</p>",

    // Place the cursor at the start of the document. This can also be set to
    // `end`, `all` or a numbered position.
    selection: "start",

    // Set the string handler which means the content provided will be
    // automatically handled as html.
    // `markdown` is also available when the `MarkdownExtension`
    // is added to the editor.
    stringHandler: "html",
  });

  useEffect(() => {
    const content = localStorage.getItem("content");
    if (content)
      manager.view.updateState(
        manager.createState({ content: JSON.parse(content) })
      );
  }, []);

  return (
    <ThemeProvider>
      <Remirror
        manager={manager}
        initialContent={state}
        hooks={hooks}
        classNames={["editorContext"]}
      >
        <MenuBar />
        <EditorComponent />
        <MentionComponent
          documents={[
            { id: "1", label: "DOC1" },
            { id: "2", label: "DOC2" },
          ]}
        />
      </Remirror>
    </ThemeProvider>
  );
}
