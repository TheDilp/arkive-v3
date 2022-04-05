import {
  BoldExtension,
  ItalicExtension,
  MentionAtomExtension,
  ImageExtension,
  BulletListExtension,
  OrderedListExtension,
  HeadingExtension,
} from "remirror/extensions";
import {
  useRemirror,
  Remirror,
  EditorComponent,
  ThemeProvider,
} from "@remirror/react";
import "remirror/styles/all.css";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";

export default function RemirrorContext() {
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
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
    ],

    // Set the initial content.
    content: "<p>I love <b>Remirror</b></p>",

    // Place the cursor at the start of the document. This can also be set to
    // `end`, `all` or a numbered position.
    selection: "start",

    // Set the string handler which means the content provided will be
    // automatically handled as html.
    // `markdown` is also available when the `MarkdownExtension`
    // is added to the editor.
    stringHandler: "html",
  });
  return (
    <ThemeProvider>
      <Remirror manager={manager} initialContent={state}>
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
