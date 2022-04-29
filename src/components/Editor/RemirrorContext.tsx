import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { htmlToProsemirrorNode } from "remirror";
import {
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  TextColorExtension,
  UnderlineExtension,
  MarkdownExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import "../../styles/Editor.css";
import { useGetDocumentData, useUpdateDocument } from "../../utils/customHooks";
import { toastSuccess, toastWarn } from "../../utils/utils";
import CustomLinkExtenstion from "./CustomLinkExtension";
import CustomMentionExtension from "./CustomMentionExtension";
// import { TableExtension } from "@remirror/extension-react-tables";
import { BubbleMenu } from "./BubbleMenu/BubbleMenu";
import MentionComponent from "./MentionComponent";
import MenuBar from "./MenuBar";
import { saveAs } from "file-saver";
import { useQueryClient } from "react-query";
import { Document } from "../../custom-types";
const hooks = [
  () => {
    const { getJSON, getText, getMarkdown } = useHelpers();
    const { project_id, doc_id } = useParams();
    const saveContentMutation = useUpdateDocument(project_id as string);
    const document = useGetDocumentData(project_id as string, doc_id as string);
    const handleSaveShortcut = useCallback(
      ({ state }) => {
        toastSuccess("Document successfully saved!");
        saveContentMutation.mutate({
          doc_id: doc_id as string,
          content: getJSON(state),
        });
        return true; // Prevents any further key handlers from being run.
      },
      [getJSON, doc_id]
    );
    const handleExportShortcut = useCallback(
      ({ state }) => {
        saveAs(
          new Blob([getMarkdown(state)], {
            type: "text/plain;charset=utf-8",
          }),
          `${document?.title || `Arkive Document - ${doc_id}`}.txt`
        );
        return true; // Prevents any further key handlers from being run.
      },
      [getText, doc_id]
    );

    // "Mod" means platform agnostic modifier key - i.e. Ctrl on Windows, or Cmd on MacOS
    useKeymap("Mod-s", handleSaveShortcut);
    useKeymap("Mod-e", handleExportShortcut);
  },
];

export default function RemirrorContext({
  setDocId,
}: {
  setDocId: (id: string) => void;
}) {
  const firstRender = useRef(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // ======================================================
  // REMIRROR SETUP
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
      new NodeFormattingExtension(),
      new TextColorExtension(),
      new MarkdownExtension(),
    ],
    selection: "all",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  const { project_id, doc_id } = useParams();
  const documents = queryClient.getQueryData<Document[]>(
    `${project_id}-documents`
  );
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );
  const [saving, setSaving] = useState<number | boolean>(false);
  const saveContentMutation = useUpdateDocument(project_id as string);
  useEffect(() => {
    if (firstRender.current) {
      setSaving(false);
      firstRender.current = false;
    }

    if (doc_id && documents) {
      if (currentDocument) {
        if (manager.view) {
          manager.view.updateState(
            manager.createState({
              content: JSON.parse(
                JSON.stringify(currentDocument.content ?? "")
              ),
            })
          );
        }
      } else {
        navigate("../");
        toastWarn("Document doesn't seem to exist.");
      }
    }
  }, [doc_id, documents]);

  useEffect(() => {
    if (doc_id) setDocId(doc_id);
  }, [doc_id]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!firstRender.current && saving && currentDocument) {
        await saveContentMutation.mutateAsync({
          doc_id: currentDocument.id,
          // @ts-ignore
          content: manager.view.state.doc.toJSON(),
        });
        setSaving(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [saving]);

  return (
    <div className="editorContainer w-8 flex flex-wrap align-content-start text-white px-2">
      <h1 className="w-full text-center my-2 Merriweather">
        {currentDocument &&
          `${currentDocument.title} ${
            currentDocument.template ? "[TEMPLATE]" : ""
          }`}
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
            <BubbleMenu />
            <MentionComponent
              documents={documents.filter((doc) => !doc.template)}
            />
          </Remirror>
        </ThemeProvider>
      )}
    </div>
  );
}
