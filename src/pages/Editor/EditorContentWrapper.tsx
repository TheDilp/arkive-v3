import { useParams } from "react-router-dom";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useAuth } from "../../hooks/useAuth";
import { useGetItem } from "../../hooks/useGetItem";
import { useGetYProvider } from "../../hooks/useGetYProvider";
import useIsLocal from "../../hooks/useIsLocal";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import Editor from "./Editor";
import EditorContainer from "./EditorContainer";

export default function EditorContentWrapper() {
  const { item_id } = useParams();
  const isLocal = useIsLocal();
  console.log(isLocal);
  const user = useAuth();
  const { provider, synced } = useGetYProvider(item_id as string, user);

  const { data: currentDocument, isFetching } = useGetItem<DocumentType>(item_id as string, "documents", {
    enabled: !!item_id || (!isLocal && !!provider),
    // staleTime: 5 * 60 * 1000,
  });

  if (isFetching || !currentDocument || (!isLocal && (!provider || !synced))) return <LoadingScreen />;
  return (
    <EditorContainer document={currentDocument} provider={provider}>
      <Editor editable />
    </EditorContainer>
  );
}
