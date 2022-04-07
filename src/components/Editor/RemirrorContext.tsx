import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  OrderedListExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import { Document } from "../../custom-types";
import { updateDocument } from "../../utils/supabaseUtils";
import { toastError, toastSuccess } from "../../utils/utils";
import CustomLinkExtenstion from "./CustomLinkExtension";
import CustomMentionExtension from "./CustomMentionExtension";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";
import "../../styles/Editor.css";
const hooks = [
  () => {
    const { getJSON } = useHelpers();
    const { doc_id } = useParams();
    const handleSaveShortcut = useCallback(
      ({ state }) => {
        updateDocument(doc_id as string, getJSON(state))
          .then(() => {
            toastSuccess("Document saved!");
          })
          .catch((err) => toastError(err?.message));
        return true; // Prevents any further key handlers from being run.
      },
      [getJSON]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
  },
];

export default function RemirrorContext() {
  const queryClient = useQueryClient();
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
      // new MentionAtomExtension({
      //   extraTags: ["link"],
      //   mentionTag: "span",
      //   extraAttributes: {
      //     onclick: "",
      //   },
      //   matchers: [
      //     {
      //       name: "at",
      //       char: "@",
      //       appendText: "",
      //     },
      //   ],
      // }),
      CustomMentionExtension,
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const { project_id, doc_id } = useParams();
  useEffect(() => {
    const allDocs: Document[] = queryClient.getQueryData(
      `${project_id}-documents`
    ) as Document[];
    setDocuments(allDocs);
    const currentDocument = allDocs.find((document) => document.id === doc_id);
    if (currentDocument) {
      manager.view.updateState(
        manager.createState({
          content: JSON.parse(JSON.stringify(currentDocument.content)),
        })
      );
    }
  }, [doc_id]);

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
          <MentionComponent documents={documents} />
        </Remirror>
      </ThemeProvider>
    </div>
  );
}
