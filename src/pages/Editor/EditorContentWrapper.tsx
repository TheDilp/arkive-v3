import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";

import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useAuth } from "../../hooks/useAuth";
import { useGetItem } from "../../hooks/useGetItem";
import { useGetYProvider } from "../../hooks/useGetYProvider";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { RoleAtom } from "../../utils/Atoms/atoms";
import Editor from "./Editor";
import EditorContainer from "./EditorContainer";

export default function EditorContentWrapper() {
  const { item_id } = useParams();
  const user = useAuth();
  const { provider, synced } = useGetYProvider(item_id as string, user);
  const UserRole = useAtomValue(RoleAtom);
  const { data: currentDocument, isFetching } = useGetItem<DocumentType>(item_id as string, "documents", {
    enabled: !!item_id || !!provider,
  });
  if (isFetching || !currentDocument || !provider || !synced) return <LoadingScreen />;
  return (
    <EditorContainer document={currentDocument} provider={provider}>
      <Editor editable={UserRole?.is_owner || UserRole?.edit_documents} />
    </EditorContainer>
  );
}
