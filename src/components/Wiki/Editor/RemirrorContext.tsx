import { TableExtension } from "@remirror/extension-react-tables";
import {
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { saveAs } from "file-saver";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, To, useParams } from "react-router-dom";
import { htmlToProsemirrorNode } from "remirror";
import {
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  DropCursorExtension,
  GapCursorExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  MarkdownExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  TextColorExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import "../../../styles/Editor.css";
import {
  useGetDocumentData,
  useGetDocuments,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { toastSuccess, toastWarn } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import { ProjectContext } from "../../Context/ProjectContext";
import CustomLinkExtenstion from "./CustomLinkExtension";
import EditorView from "./EditorView";
import MentionReactComponent from "./MentionReactComponent/MentionReactComponent";
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
          id: doc_id as string,
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
          `${document?.title || `Arkive Document - ${doc_id}`}.md`
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

export default function RemirrorContext({ editable }: { editable?: boolean }) {
  const { project_id, doc_id } = useParams();
  const firstRender = useRef(true);
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );
  // ======================================================
  // REMIRROR SETUP
  const CustomMentionExtension = new MentionAtomExtension({
    matchers: [
      {
        name: "at",
        char: "@",
        appendText: "",
        supportedCharacters: /[^\s][\w\d_ ]+/,
      },
      {
        name: "hash",
        char: "#",
        appendText: "",
        supportedCharacters: /[^\s][\w\d_ ]+/,
      },
      {
        name: "dollah",
        char: "$",
        appendText: "",
        supportedCharacters: /[^\s][\w\d_ ]+/,
      },
    ],
  });
  CustomMentionExtension.ReactComponent = MentionReactComponent;

  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new UnderlineExtension(),
      new ImageExtension({
        enableResizing: true,
      }),
      // new CustomImageExtension(),
      new BulletListExtension(),
      new OrderedListExtension(),
      CustomMentionExtension,
      CustomLinkExtenstion,
      new HorizontalRuleExtension(),
      new CalloutExtension(),
      new NodeFormattingExtension(),
      new TextColorExtension(),
      new MarkdownExtension(),
      new TableExtension(),
      new GapCursorExtension(),
      new DropCursorExtension(),
    ],
    selection: "all",
    content: currentDocument?.content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  const { data: documents } = useGetDocuments(project_id as string);
  const [saving, setSaving] = useState<number | boolean>(false);
  const saveContentMutation = useUpdateDocument(project_id as string);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!firstRender.current && saving && currentDocument) {
        await saveContentMutation.mutateAsync({
          id: currentDocument.id,
          // @ts-ignore
          content: manager.view.state.doc.toJSON(),
        });
        setSaving(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [saving]);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { id: docId, setId: setDocId } = useContext(ProjectContext);

  useEffect(() => {
    if (doc_id && doc_id !== docId) {
      setDocId(doc_id);
    }
  }, [doc_id]);

  if (!currentDocument) {
    toastWarn("Document not found");
    return <Navigate to={-1 as To} />;
  }
  return (
    <div
      className={`editorContainer ${
        // Check if latop, then if mobile/tablet and set width
        isTabletOrMobile ? "w-12" : isLaptop ? "w-9" : "w-10"
      } h-full flex flex-wrap align-content-start text-white px-2`}
    >
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
            classNames={["text-white Lato Editor overflow-y-auto"]}
            onChange={(props) => {
              const { tr, firstRender } = props;
              if (!firstRender && tr?.docChanged) {
                setSaving(tr?.time);
              }
            }}
            editable={editable || true}
          >
            <EditorView
              saving={saving}
              setSaving={setSaving}
              firstRender={firstRender}
            />
          </Remirror>
        </ThemeProvider>
      )}
    </div>
  );
}
