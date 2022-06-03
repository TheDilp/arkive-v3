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
import { Navigate, useParams } from "react-router-dom";
import {
  htmlToProsemirrorNode,
  prosemirrorNodeToHtml,
  RemirrorJSON,
} from "remirror";
import {
  AnnotationExtension,
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CalloutExtension,
  DropCursorExtension,
  GapCursorExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  UnderlineExtension,
  YjsExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import { WebrtcProvider } from "y-webrtc";
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
import CustomLinkExtenstion from "./CustomLinkExtension";
import EditorView from "./EditorView";
import MentionReactComponent from "./MentionReactComponent/MentionReactComponent";
import { useDebouncedCallback } from "use-debounce";
import useObservableListener from "./useObservableListener";
import { useWebRtcProvider } from "../../../utils/yjsHooks";
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
  provider,
}: {
  editable?: boolean;
  provider: WebrtcProvider;
}) {
  const { project_id, doc_id } = useParams();
  const [docState, setDocState] = useState<RemirrorJSON | null>();
  const [clientCount, setClientCount] = useState<number>(0);
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const firstRender = useRef(true);
  const usedFallbackRef = useRef(false);
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
  const { data: documents } = useGetDocuments(project_id as string);
  const TIMEOUT = 1500;
  const { manager, getContext } = useRemirror({
    extensions: () => [
      new AnnotationExtension(),
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new UnderlineExtension(),
      new BlockquoteExtension(),
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
      new TableExtension(),
      new GapCursorExtension(),
      new DropCursorExtension(),
      new YjsExtension({
        getProvider: () => provider as WebrtcProvider,
        cursorStateField: "user",
      }),
    ],
    selection: "all",
    // content: currentDocument?.content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  const handlePeersChange = useCallback(
    ({ webrtcPeers }) => {
      setClientCount(webrtcPeers.length);
    },
    [setClientCount]
  );

  useObservableListener("peers", handlePeersChange, provider);
  // ======================================================

  const [saving, setSaving] = useState<number | boolean>(false);
  const saveContentMutation = useUpdateDocument(project_id as string);
  const handleChange = useCallback(
    ({ state, tr }) => {
      if (tr?.docChanged) {
        setDocState(state.toJSON().doc);
      }
    },
    [setDocState]
  );
  const handleSave = useCallback(
    (newDocState) => {
      saveContentMutation.mutate({
        id: doc_id as string,
        content: newDocState,
      });
      if (provider) {
        const meta = provider.doc.getMap("meta");
        meta.set("lastSaved", Date.now());
      }
    },
    [doc_id, provider?.doc]
  );
  const handleSaveDebounced = useDebouncedCallback(handleSave, TIMEOUT);
  const handleYDocUpdate = useCallback(() => {
    handleSaveDebounced.cancel();
  }, [handleSaveDebounced]);
  useObservableListener("update", handleYDocUpdate, provider.doc);

  useEffect(() => {
    if (doc_id) {
      if (doc_id !== docId) setDocId(doc_id);
    }

    if (usedFallbackRef.current) return;

    const fetchFallback = async () => {
      if (provider?.connected && clientCount === 0) {
        getContext()?.setContent(currentDocument?.content || "");
      }
      usedFallbackRef.current = true;
    };
    const timeout = setTimeout(() => {
      fetchFallback();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [doc_id, getContext, provider?.connected, clientCount]);

  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);

  useEffect(() => {
    handleSaveDebounced(docState);
  }, [handleSaveDebounced, docState]);

  if (!currentDocument) {
    toastWarn("Document not found");
    return <Navigate to={"../"} />;
  }

  return (
    <div
      className={`editorContainer overflow-y-scroll ${
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
      <Breadcrumbs currentDocument={currentDocument} />
      {documents && (
        <ThemeProvider>
          <Remirror
            manager={manager}
            // initialContent={state}
            hooks={hooks}
            classNames={["text-white Lato"]}
            onChange={handleChange}
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
