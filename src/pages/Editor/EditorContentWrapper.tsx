import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useGetItem } from "../../hooks/useGetItem";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import Editor from "./Editor";
import EditorContainer from "./EditorContainer";

export default function EditorContentWrapper() {
  const { item_id } = useParams();
  const firstRender = useRef(true);
  const queryClient = useQueryClient();
  const [provider, setProvider] = useState<WebsocketProvider | null>();
  const { data: currentDocument, isFetching } = useGetItem<DocumentType>(item_id as string, "documents", {
    enabled: !!item_id,
    // staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (firstRender.current && !provider) {
      const yDoc = new Y.Doc();
      setProvider(new WebsocketProvider(import.meta.env.VITE_SYNC_SERVER, item_id as string, yDoc));
      firstRender.current = false;
    } else if (provider) {
      provider?.destroy();
      const yDoc = new Y.Doc();
      setProvider(new WebsocketProvider(import.meta.env.VITE_SYNC_SERVER, item_id as string, yDoc));
    }
    return () => {
      queryClient.removeQueries({ queryKey: ["documents", item_id] });
      provider?.disconnect();
      // provider?.destroy();
      // setProvider(null);
      firstRender.current = true;
    };
  }, [item_id]);

  if (isFetching || !currentDocument || !provider) return <LoadingScreen />;
  return (
    <EditorContainer document={currentDocument} provider={provider}>
      <Editor editable />
    </EditorContainer>
  );
}
