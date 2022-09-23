import { AutoComplete } from "primereact/autocomplete";
import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate, To, useNavigate, useParams } from "react-router-dom";
import {
  auth,
  getPublicDocuments,
  getSingleDocument,
} from "../../../utils/supabaseUtils";
import { toastWarn } from "../../../utils/utils";
import LoadingScreen from "../../Util/LoadingScreen";
import PublicEditor from "./PublicEditor/PublicEditor";

export default function PublicWiki() {
  const { project_id, doc_id } = useParams();
  const user = auth.user();
  const { data: document, isLoading } = useQuery(
    doc_id as string,
    async () => await getSingleDocument(doc_id as string)
  );
  const { data: publicDocuments, isLoading: isLoadingPublicDocuments } =
    useQuery(
      `publicDocuments-${project_id}`,
      async () => await getPublicDocuments(project_id as string)
    );
  const [search, setSearch] = useState<any>();
  const [filtered, setFiltered] = useState<any>([]);
  const navigate = useNavigate();
  if (isLoading || isLoadingPublicDocuments) return <LoadingScreen />;
  if (!document || (!document.public && !user)) {
    toastWarn("This page is not public.");
    return <Navigate to={-1 as To} />;
  }
  return (
    <div className="w-full h-full flex flex-column overflow-y-auto py-6">
      <div className="w-full lg:w-6 mx-auto flex justify-content-end align-items-end">
        <AutoComplete
          value={search}
          suggestions={filtered}
          completeMethod={(e) => {
            let _filteredDocs;
            if (!e.query.trim().length && publicDocuments) {
              _filteredDocs = [...publicDocuments];
            } else {
              _filteredDocs = publicDocuments?.filter((doc) => {
                return doc.title.toLowerCase().includes(e.query.toLowerCase());
              });
            }
            setFiltered(_filteredDocs);
          }}
          className="h-2rem w-full flex justify-content-end"
          inputClassName="border-x-none border-top-none border-bottom-2 w-15rem mb-1 outline-none"
          placeholder="🔍"
          field="title"
          onChange={(e) => setSearch(e.value)}
          onSelect={(e) => {
            if (e.value) {
              navigate(`../wiki/${e.value.id}`);
              setSearch(null);
            }
          }}
        />
      </div>

      <div className="w-full lg:w-6 mx-auto h-fit surface-50 shadow-3">
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
