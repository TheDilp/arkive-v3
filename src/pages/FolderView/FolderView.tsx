import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { FolderViewCards } from "./FolderViewCards";

export default function FolderView() {
  const { project_id, item_id, type } = useParams();

  const { data, isFetching } = useGetAllItems<AllItemsType>(project_id as string, type as AvailableItemTypes, {
    staleTime: 5 * 60 * 1000,
  });
  if (isFetching) return <LoadingScreen />;
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden px-8">
      <Breadcrumbs type={type as AvailableItemTypes} />
      {data ? (
        <FolderViewCards
          items={
            (data || [])
              ?.filter((item) => {
                if ("template" in item) {
                  return !item.template;
                }
                return true;
              })
              ?.filter((item) => {
                if (item_id) return item.parentId === item_id;
                return !item.parentId;
              }) || []
          }
          type={type as AvailableItemTypes}
        />
      ) : null}
    </div>
  );
}
