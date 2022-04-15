import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
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
import { RemirrorJSON } from "remirror";
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
                        // Return the parent from the old document because it is a foreign table query
                        // The updated Doc has id only, but {id, title} is required
                        return { ...updatedDocument, parent: doc.parent };
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
  setDocId,
}: {
  setDocId: (docId: string) => void;
}) {
  const firstRender = useRef(true);
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
    selection: "all",
    stringHandler: "html",
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const { project_id, doc_id } = useParams();
  const [saving, setSaving] = useState<number | boolean>(false);

  const saveContentMutation = useMutation(
    async (vars: { doc_id: string; content: RemirrorJSON }) => {
      await updateDocument(
        vars.doc_id,
        undefined,
        // @ts-ignore
        vars.content
      );
    },
    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);

        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return {
                    ...doc,
                    content: updatedDocument.content,
                  };
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

        return { previousDocuments };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
      },
      onSuccess: () => {
        setSaving(false);
      },
    }
  );

  useEffect(() => {
    if (firstRender.current) {
      setSaving(false);
      firstRender.current = false;
    }
    // else {
    //   firstRender.current = true;
    // }
    if (doc_id) {
      setDocId(doc_id);
      const documents: Document[] | undefined = queryClient.getQueryData(
        `${project_id}-documents`
      );
      if (documents) {
        setDocuments(documents);
        const currentDocData = documents.find(
          (document) => document.id === doc_id
        );
        if (currentDocData) {
          setCurrentDocument(currentDocData);
          if (currentDocData.content) {
            manager.view.updateState(
              manager.createState({
                content: JSON.parse(JSON.stringify(currentDocData.content)),
              })
            );
          }
        }
      }
    }
  }, [doc_id]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!firstRender.current && saving && currentDocument) {
        await saveContentMutation.mutateAsync({
          doc_id: currentDocument.id,
          // @ts-ignore
          content: manager.view.state.doc.toJSON(),
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [saving]);

  return (
    <div className="editorContainer w-8 flex flex-wrap align-content-start text-white px-2">
      <h1 className="w-full text-center my-2 Merriweather">
        {currentDocument && currentDocument.title}
      </h1>
      {documents && (
        <ThemeProvider>
          <Remirror
            manager={manager}
            initialContent={state}
            hooks={hooks}
            classNames={["text-white Lato Editor overflow-y-scroll"]}
            onChange={(props) => {
              const { tr, firstRender } = props;
              if (!firstRender && tr?.docChanged) {
                setSaving(tr?.time);
              }
            }}
          >
            <MenuBar saving={saving} />
            <EditorComponent />
            <MentionComponent documents={documents} />
          </Remirror>
        </ThemeProvider>
      )}
    </div>
  );
}
