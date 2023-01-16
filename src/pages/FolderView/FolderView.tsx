import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType } from "../../types/generalTypes";
import { getItemTypeFromURL } from "../../utils/transform";
import { FolderViewCards } from "./FolderViewCards";

export default function FolderView() {
  const { project_id, item_id } = useParams();

  const { pathname } = useLocation();
  const type = getItemTypeFromURL(pathname);
  const { data } = useGetAllItems<AllItemsType>(project_id as string, type);
  return (
    <div className="flex flex-col gap-4 overflow-hidden px-8">
      <Breadcrumbs type={type} />
      <FolderViewCards
        items={
          data?.filter((item) => {
            if (item_id) return item.parentId === item_id;
            return !item.parentId;
          }) || []
        }
        type={type}
      />
    </div>
  );
}
