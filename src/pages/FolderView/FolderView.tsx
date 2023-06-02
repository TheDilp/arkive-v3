import { useAtomValue } from "jotai";
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { FolderSkeleton } from "../../components/Skeleton/Skeleton";
import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes } from "../../types/generalTypes";
import { DocumentsSidebar, ProjectAtom } from "../../utils/Atoms/atoms";
import { setTabTitle } from "../../utils/uiUtils";
import { FolderViewCards } from "./FolderViewCards";

export default function FolderView() {
  const { project_id, item_id, type } = useParams();
  const projectData = useAtomValue(ProjectAtom);
  const documentsTab = useAtomValue(DocumentsSidebar);
  const { data, isFetching, isLoading } = useGetAllItems<AllItemsType>(project_id as string, type as AvailableItemTypes, {
    staleTime: 5 * 60 * 1000,
  });
  useLayoutEffect(() => {
    if (projectData) {
      setTabTitle(projectData.title);
    }
  }, [projectData]);
  return (
    <div className="folderView flex flex-1 flex-col gap-4 overflow-hidden px-8">
      <Breadcrumbs type={type as AvailableItemTypes} />
      {isLoading && isFetching ? <FolderSkeleton /> : null}

      {!isLoading && data && data.length > 0 ? (
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
