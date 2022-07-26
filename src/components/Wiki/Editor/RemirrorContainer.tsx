import { Icon } from "@iconify/react";
import {
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { saveAs } from "file-saver";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { htmlToProsemirrorNode, prosemirrorNodeToHtml } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  ColumnsExtension,
  DropCursorExtension,
  GapCursorExtension,
  HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  PlaceholderExtension,
  TaskListExtension,
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
import Breadcrumbs from "../FolderPage/Breadcrumbs";
import CustomLinkExtenstion from "./CustomExtensions/CustomLink/CustomLinkExtension";
import MentionReactComponent from "./CustomExtensions/CustomMention/MentionReactComponent/MentionReactComponent";
import { MapPreviewExtension } from "./CustomExtensions/CustomPreviews/MapPreviewExtension";
import { SecretExtension } from "./CustomExtensions/SecretExtension/SecretExtension";
import EditorView from "./EditorView";
const hooks = [
  () => {
    const { getJSON, getText } = useHelpers();
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
        let htmlString = prosemirrorNodeToHtml(state.doc);
        saveAs(
          new Blob([htmlString], {
            type: "text/html;charset=utf-8",
          }),
          `${document?.title || `Arkive Document - ${doc_id}`}.html`
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

export default function RemirrorContainer({
  editable,
}: {
  editable?: boolean;
}) {
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
      },
      {
        name: "hash",
        char: "#",
        appendText: "",
      },
      {
        name: "dollah",
        char: "$",
        appendText: "",
      },
    ],
  });
  CustomMentionExtension.ReactComponent = useMemo(
    () => MentionReactComponent,
    []
  );

  const { manager, state } = useRemirror({
    extensions: () => [
      new PlaceholderExtension({
        placeholder: "Write something awesome! 📜",
      }),
      new BoldExtension(),
      new ColumnsExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new UnderlineExtension(),
      new BlockquoteExtension(),
      new BulletListExtension(),
      new TaskListExtension(),
      new OrderedListExtension(),
      CustomLinkExtenstion,
      new ImageExtension({
        enableResizing: true,
      }),
      new HorizontalRuleExtension(),
      new CalloutExtension(),
      new NodeFormattingExtension(),
      new HardBreakExtension(),
      new SecretExtension({
        extraAttributes: {
          class: "secretBlock",
        },
        secret: "true",
        classNames: "secretBlock",
      }),
      CustomMentionExtension,
      new MapPreviewExtension({
        public_view: false,
        type: null,
      }),
      new GapCursorExtension(),
      new DropCursorExtension(),
    ],
    onError: ({ json, invalidContent, transformers }) => {
      // Automatically remove all invalid nodes and marks.
      return transformers.remove(json, invalidContent);
    },
    selection: "all",
    content: currentDocument?.content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  const { data: documents } = useGetDocuments(project_id as string);
  const [saving, setSaving] = useState<number | boolean>(false);
  const saveContentMutation = useUpdateDocument(project_id as string);

  useEffect(() => {
    let content = manager.view.state.doc.toJSON();
    const timeout = setTimeout(() => {
      if (!firstRender.current && saving && currentDocument) {
        saveContentMutation.mutate({
          id: currentDocument.id,
          // @ts-ignore
          content,
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
    return <Navigate to={"../"} />;
  }
  return (
    <div
      className={`editorContainer overflow-y-scroll text-base ${
        // Check if latop, then if mobile/tablet and set width
        isTabletOrMobile ? "w-12" : isLaptop ? "w-9" : "w-10"
      } h-full flex flex-wrap align-content-start text-white px-2`}
    >
      <h1 className="w-full mt-2 mb-0 text-4xl flex justify-content-center Merriweather">
        {currentDocument && (
          <>
            <Icon className="mr-2" fontSize={40} icon={currentDocument.icon} />
            {currentDocument.title}
            {currentDocument.template ? "[TEMPLATE]" : ""}
          </>
        )}
      </h1>
      <Breadcrumbs currentDocument={currentDocument} />
      {documents && (
        <ThemeProvider>
          <Remirror
            manager={manager}
            initialContent={state}
            hooks={hooks}
            classNames={["text-white Lato"]}
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
