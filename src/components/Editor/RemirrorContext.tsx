import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  MentionAtomExtension,
  OrderedListExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import { toastSuccess } from "../../utils/utils";
import CustomLinkExtenstion from "./CustomLinkExtension";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";

const hooks = [
  () => {
    const { getJSON } = useHelpers();

    const handleSaveShortcut = useCallback(
      ({ state }) => {
        localStorage.setItem("content", JSON.stringify(getJSON(state)));
        toastSuccess("Document saved!");

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
    <div style={{ width: "80%", display: "flex", justifyContent: "center" }}>
      <ThemeProvider>
        <ToastContainer />
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
    </div>
  );
}
