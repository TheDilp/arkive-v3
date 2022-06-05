import { TableExtension } from "@remirror/extension-react-tables";
import {
  Remirror,
  ThemeProvider,
  useHelpers,
  useKeymap,
  useRemirror,
} from "@remirror/react";
import { observeDeep } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { saveAs } from "file-saver";
import { Tooltip } from "primereact/tooltip";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  MentionAtomExtension,
  NodeFormattingExtension,
  OrderedListExtension,
  UnderlineExtension,
} from "remirror/extensions";
import "remirror/styles/all.css";
import { prosemirrorJSONToYDoc } from "y-prosemirror";
import { WebrtcProvider } from "y-webrtc";
import { applyUpdate, Doc, encodeStateAsUpdate, encodeStateVector } from "yjs";
import "../../../styles/Editor.css";
import {
  useGetDocumentData,
  useGetDocuments,
  useGetProfile,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { toastSuccess, toastWarn } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import { ProjectContext } from "../../Context/ProjectContext";
import Breadcrumbs from "../FolderPage/Breadcrumbs";
import CustomLinkExtenstion from "./CustomLinkExtension";
import EditorView from "./EditorView";
import MentionReactComponent from "./MentionReactComponent/MentionReactComponent";
import useObservableListener from "./ObservableListener";
import { awareness, store, yDoc } from "./SyncedStore";
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
  const webrtcProvider = useMemo(
    () =>
      new WebrtcProvider(doc_id as string, yDoc as Doc, {
        awareness,
      }),
    []
  );

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
  // const Positioner = new PositionerExtension();

  const storeState = useSyncedStore(store);
  const [clientCount, setClientCount] = useState<number>(0);
  const { manager, state, getContext } = useRemirror({
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
      // new GapCursorExtension(),
      // new DropCursorExtension(),
      // new YjsExtension({
      //   getProvider: () => webrtcProvider,
      // }),
    ],
    selection: "all",
    // content: storeState.remirrorContent.content || "",
    stringHandler: htmlToProsemirrorNode,
  });
  // ======================================================
  const { data: documents } = useGetDocuments(project_id as string);
  const profile = useGetProfile();
  const [saving, setSaving] = useState<number | boolean>(false);
  const saveContentMutation = useUpdateDocument(project_id as string);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      awareness.setLocalStateField("user", {
        nickname: profile.nickname,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        doc_id,
      });
    }
  }, [profile]);

  useEffect(() => {
    awareness.on("change", () => {
      let tempUsers: { nickname: string; color: string }[] = [];
      awareness.states.forEach((state) =>
        tempUsers.push(
          state as { nickname: string; color: string; doc_id: string }
        )
      );
      setUsers(tempUsers);
    });

    observeDeep(storeState, () => {
      const test = JSON.parse(
        JSON.stringify(storeState.remirrorContent.content)
      );
      getContext()?.setContent(test);
    });
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
  }, []);
  console.log(users);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { id: docId, setId: setDocId } = useContext(ProjectContext);

  useEffect(() => {
    if (currentDocument) {
      storeState.remirrorContent.content = currentDocument?.content || [];
    }
  }, [currentDocument]);

  useEffect(() => {
    if (doc_id) {
      awareness.setLocalStateField("user", {
        nickname: profile?.nickname,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        doc_id,
      });
      if (doc_id !== docId) {
        setDocId(doc_id);
      }
    }

    return () => {
      // disconnect();
    };
  }, [doc_id]);
  console.log(users);
  useEffect(() => {
    if (currentDocument && doc_id) {
      if (usedFallbackRef.current) return;
      const fetchFallback = async () => {
        const doc = prosemirrorJSONToYDoc(
          manager.schema,
          currentDocument.content as RemirrorJSON
        );
        const stateVector1 = encodeStateVector(webrtcProvider.doc);
        const diff = encodeStateAsUpdate(doc, stateVector1);
        applyUpdate(webrtcProvider.doc, diff);
        usedFallbackRef.current = true;
      };
      const timeout = setTimeout(fetchFallback, 750);
      return () => {
        clearTimeout(timeout);
        // webrtcProvider.disconnect();
        // awareness.destroy();
      };
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
      <div className="absolute flex mt-2 w-8 justify-content-end">
        <div className="relative pr-5">
          {users &&
            users.map((user, index) =>
              user.user.doc_id === doc_id ? (
                <span key={index}>
                  <Tooltip
                    target={`.${user.user?.nickname}`}
                    content={user.user?.nickname}
                    position="bottom"
                  />
                  <div
                    id={user.user?.nickname}
                    className={`border-circle cursor-pointer w-2rem h-2rem absolute ml-${
                      index * 2
                    } ${user.user?.nickname}`}
                    style={{
                      backgroundColor: user.user?.color || "#ff0000",
                    }}
                  ></div>
                </span>
              ) : null
            )}
        </div>
      </div>
      {documents && users.length !== 0 && (
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
                // setSaving(tr.time);
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
