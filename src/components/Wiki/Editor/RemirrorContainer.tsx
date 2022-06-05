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
import { useSyncedStore } from "@syncedstore/react";
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from "y-prosemirror";
import {
  awareness,
  connect,
  disconnect,
  setRoom,
  store,
  webrtcProvider,
} from "./SyncedStore";
import { observeDeep } from "@syncedstore/core";
import { applyUpdate, encodeStateAsUpdate, encodeStateVector } from "yjs";
import useObservableListener from "./ObservableListener";
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
  
  const storeState = useSyncedStore(store);
  const [clientCount, setClientCount] = useState<number>(0);
  const { manager, state } = useRemirror({
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
      new YjsExtension({ getProvider: () => webrtcProvider }),
    ],
    selection: "all",
    // content: storeState.remirrorContent.content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================

  const { data: documents } = useGetDocuments(project_id as string);
  const [saving, setSaving] = useState<number | boolean>(false);
  const saveContentMutation = useUpdateDocument(project_id as string);
  const handleChange = useCallback(({ state, tr }) => {
    if (tr?.docChanged) {
      store.remirrorContent.content = manager.view.state.doc.toJSON();
    }
  }, []);
  // useEffect(() => {
  //   const timeout = setTimeout(async () => {
  //     if (!firstRender.current && saving && currentDocument) {
  //       store.remirrorContent.content = currentDocument.content;
  //       await saveContentMutation.mutateAsync({
  //         id: currentDocument.id,
  //         content: store.remirrorContent.content,
  //       });
  //       setSaving(false);
  //     }
  //   }, 300);

  //   return () => clearTimeout(timeout);
  // }, [saving]);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { id: docId, setId: setDocId } = useContext(ProjectContext);

  useEffect(() => {
    if (doc_id && doc_id !== docId) {
      setDocId(doc_id);
      setRoom(doc_id);
    }

    return () => {
      // disconnect();
    };
  }, [doc_id]);

  useEffect(() => {
    awareness.getStates().forEach((state) => {
      console.log(state);
      if (state.user) {
        console.log(state.user);
        setClientCount(clientCount + 1);
      }
    });
  }, []);

  useEffect(() => {
    if (currentDocument && doc_id) {
      if (usedFallbackRef.current) return;
      const fetchFallback = async () => {
        if (webrtcProvider.connected && clientCount === undefined) {
          const doc = prosemirrorJSONToYDoc(
            manager.schema,
            currentDocument.content as RemirrorJSON
          );
          const stateVector1 = encodeStateVector(webrtcProvider.doc);
          const diff = encodeStateAsUpdate(doc, stateVector1);
          applyUpdate(webrtcProvider.doc, diff);
          // const update = encodeStateAsUpdate(doc);
          // applyUpdate(webrtcProvider.doc, update);
        }
        usedFallbackRef.current = true;
      };
      const timeout = setTimeout(fetchFallback, 1000);
      return () => clearTimeout(timeout);
    }
  }, [doc_id]);
  const handlePeersChange = useCallback(
    ({ webrtcPeers }) => {
      setClientCount(webrtcPeers.length);
    },
    [setClientCount]
  );

  useObservableListener("peers", handlePeersChange, webrtcProvider);
  useObservableListener("synced", (d) => setClientCount(1), webrtcProvider);
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
            initialContent={state}
            hooks={hooks}
            classNames={["text-white Lato"]}
            onChange={(props) => {
              const { tr, firstRender } = props;
              if (!firstRender && tr?.docChanged) {
                storeState.remirrorContent.content =
                  manager.view.state.doc.toJSON();
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
