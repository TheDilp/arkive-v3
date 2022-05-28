import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getSingleDocument } from "../../../utils/supabaseUtils";
import LoadingScreen from "../../Util/LoadingScreen";
import PublicEditor from "./PublicEditor/PublicEditor";

export default function PublicWiki() {
  const { doc_id } = useParams();
  const { data, isLoading } = useQuery(
    doc_id as string,
    async () => await getSingleDocument(doc_id as string)
  );
  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className="w-full h-full flex overflow-y-auto">
      <div className="w-full lg:w-6 mx-auto h-fit surface-50 shadow-3">
        <h1 className="Merriweather text-white text-center">
          {data?.title || ""}
        </h1>
        {data && (
          <PublicEditor
            classes="publicPage overflow-y-hidden"
            content={data?.content}
          />
        )}
      </div>
    </div>
  );
}
