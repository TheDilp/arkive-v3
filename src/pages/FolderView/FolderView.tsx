import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { AllItemsType } from "../../types/generalTypes";
import { getType } from "../../utils/transform";
import { FolderViewCards } from "./FolderViewCards";

export default function FolderView() {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();

  const { pathname } = useLocation();
  const type = getType(pathname);
  const data: AllItemsType[] | undefined = queryClient.getQueryData(["allItems", project_id as string, type]);

  return (
    <div className="flex flex-col gap-4 px-8">
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
