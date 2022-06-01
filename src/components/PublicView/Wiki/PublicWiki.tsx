import { useQuery } from "react-query";
import { Navigate, To, useParams } from "react-router-dom";
import { auth, getSingleDocument } from "../../../utils/supabaseUtils";
import { toastWarn } from "../../../utils/utils";
import LoadingScreen from "../../Util/LoadingScreen";
import PublicEditor from "./PublicEditor/PublicEditor";

export default function PublicWiki() {
  const { doc_id } = useParams();
  const user = auth.user();
  const { data: document, isLoading } = useQuery(
    doc_id as string,
    async () => await getSingleDocument(doc_id as string)
  );
  if (isLoading) return <LoadingScreen />;
  if (!document || (!document.public && !user)) {
    toastWarn("This page is not public.");
    return <Navigate to={-1 as To} />;
  }
  return (
    <div className="w-full h-full flex overflow-y-auto">
      <div className="w-full lg:w-6 mx-auto h-fit surface-50 shadow-3 mt-6">
        <h1 className="Merriweather text-white text-center">
          {document?.title || ""}
        </h1>
        {document && (
          <PublicEditor
            classes="publicPage overflow-y-hidden"
            content={document?.content}
          />
        )}
      </div>
    </div>
  );
}
