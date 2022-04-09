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
    const { project_id, doc_id } = useParams();
    const queryClient = useQueryClient();
    const handleSaveShortcut = useCallback(
      ({ state }) => {
        updateDocument(doc_id as string, undefined, getJSON(state))
          .then((data: Document | undefined) => {
            if (data) {
              let updatedDocument = data;
              queryClient.setQueryData(
                `${project_id}-documents`,
                (oldData: Document[] | undefined) => {
                  if (oldData) {
                    let newData: Document[] = oldData.map((doc) => {
                      if (doc.id === updatedDocument.id) {
                        return updatedDocument;
                      } else {
                        return doc;
                      }
                    });
                    return newData;
                  } else {
                    return [];
                  }
                }
              );
              toastSuccess(`Document ${updatedDocument.title} saved`);
            }
          })
          .catch((err) => toastError(err?.message));
        return true; // Prevents any further key handlers from being run.
      },
      [getJSON, doc_id]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
  },
];

export default function RemirrorContext({
  documents,
  setDocuments,
  setDocId,
}: {
  documents: Document[];
  setDocId: (docId: string) => void;
  setDocuments: (documents: Document[]) => void;
}) {
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
      CustomMentionExtension,
      CustomLinkExtenstion,
      new HorizontalRuleExtension(),
      new CalloutExtension(),
    ],
    content: "<p>This is awesome</p>",
    selection: "start",
    stringHandler: "html",
  });
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const { project_id, doc_id } = useParams();

  useEffect(() => {
    const allDocs: Document[] = queryClient.getQueryData(
      `${project_id}-documents`
    ) as Document[];
    setDocuments(allDocs);
  }, [queryClient.getQueryData(`${project_id}-documents`)]);

  useEffect(() => {
    if (doc_id) {
      setDocId(doc_id);
      if (documents) {
        const currentDocument = documents.find(
          (document) => document.id === doc_id
        );
        if (currentDocument) {
          setCurrentDocument(currentDocument);
          if (currentDocument.content) {
            manager.view.updateState(
              manager.createState({
                content: JSON.parse(JSON.stringify(currentDocument.content)),
              })
            );
          }
        }
      }
    }
  }, [doc_id, documents]);

  return (
    <div className="editorContainer w-8 flex flex-wrap align-content-start text-white px-2">
      <h1 className="w-full text-center my-2 Merriweather">
        {currentDocument && currentDocument.title}
      </h1>
      <ThemeProvider>
        <Remirror
          manager={manager}
          initialContent={state}
          hooks={hooks}
          classNames={["surface-50 text-white Lato Editor"]}
        >
          <MenuBar />
          <EditorComponent />
          <MentionComponent documents={documents} />
        </Remirror>
      </ThemeProvider>
    </div>
  );
}
