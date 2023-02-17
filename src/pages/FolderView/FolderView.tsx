import { useAtom } from "jotai";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { DocumentsSidebar } from "../../utils/Atoms/atoms";
import { FolderViewCards } from "./FolderViewCards";

export default function FolderView() {
  const { project_id, item_id, type } = useParams();
  const [documentsTab] = useAtom(DocumentsSidebar);
  const { data, isFetching } = useGetAllItems<AllItemsType>(project_id as string, type as AvailableItemTypes, {
    staleTime: 5 * 60 * 1000,
  });
  if (isFetching) return <LoadingScreen />;
  return (
    <div className="folderView flex flex-1 flex-col gap-4 overflow-hidden px-8">
      <Breadcrumbs type={type as AvailableItemTypes} />
      {data && data.length > 0 ? (
        <FolderViewCards
          items={
            (data || [])
              ?.filter((item) => {
                if ("template" in item) {
                  if (documentsTab === 0) return !item.template;
                  return item.template;
                }
                return true;
              })
              ?.filter((item) => {
                if (item_id) return item.parentId === item_id;
                return !item.parentId;
              })
              .sort((a, b) => a.sort - b.sort) || []
          }
          type={type as AvailableItemTypes}
        />
      ) : (
        "There is no content."
      )}
    </div>
  );
}
