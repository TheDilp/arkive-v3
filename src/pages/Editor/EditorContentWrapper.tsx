import { useParams } from "react-router-dom";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useAuth } from "../../hooks/useAuth";
import { useGetItem } from "../../hooks/useGetItem";
import { useGetYProvider } from "../../hooks/useGetYProvider";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import Editor from "./Editor";
import EditorContainer from "./EditorContainer";

export default function EditorContentWrapper() {
  const { item_id } = useParams();
  const user = useAuth();
  const { provider, synced } = useGetYProvider(item_id as string, user);

  const { data: currentDocument, isFetching } = useGetItem<DocumentType>(item_id as string, "documents", {
    enabled: !!item_id && !!provider,
    // staleTime: 5 * 60 * 1000,
  });

  if (isFetching || !currentDocument || !provider || !synced) return <LoadingScreen />;
  return (
    <EditorContainer document={currentDocument} provider={provider}>
      <Editor editable />
    </EditorContainer>
  );
}
