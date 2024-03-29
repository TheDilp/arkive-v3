import { SetStateAction } from "jotai";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dispatch, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { AllItemsType, AvailableItemTypes, BreadcrumbsType } from "../../types/generalTypes";

export default function Breadcrumbs({ type }: { type: AvailableItemTypes }) {
  const { project_id, item_id } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsType>([]);
  const { data } = useGetAllItems<AllItemsType>(project_id as string, type, { staleTime: 5 * 60 * 1000 });
  const currentItem = data?.find((item) => item.id === item_id);
  const navigate = useNavigate();
  function recursiveFindParents(
    parent_id: string | null,
    recursiveDocuments: AllItemsType[],
    tempBreadcrumbs: BreadcrumbsType,
    setCrumbs: Dispatch<SetStateAction<BreadcrumbsType>>,
  ) {
    if (parent_id) {
      const parent = recursiveDocuments.find((doc) => doc.id === parent_id);
      if (parent) {
        tempBreadcrumbs.push({
          template: (
            <Link
              className="fontWeight700 text-white"
              to={`/project/${project_id}/documents/${parent.folder ? "folder/" : ""}${parent.id}`}>
              {parent.title}
            </Link>
          ),
        });

        recursiveFindParents(parent.parentId || null, recursiveDocuments, tempBreadcrumbs, setCrumbs);
      }
    } else {
      setCrumbs(tempBreadcrumbs.reverse());
    }
  }

  useEffect(() => {
    if (data && data.length > 0) {
      if (currentItem) {
        const tempBreadcrumbs: BreadcrumbsType = [
          {
            template: (
              <Link
                className="font-bold text-white"
                to={`/project/${project_id}/${currentItem.folder ? "folder" : "documents"}/${currentItem.id}`}>
                {currentItem.title}
              </Link>
            ),
          },
        ];
        recursiveFindParents(currentItem?.parentId || null, data as AllItemsType[], tempBreadcrumbs, setBreadcrumbs);
      } else {
        setBreadcrumbs([]);
      }
    }
  }, [item_id, currentItem, data]);

  return (
    <BreadCrumb
      className="border-bottom-2 border-noround z-5 w-full border-none font-bold"
      home={{
        className: "flex",
        command: () => navigate(`/project/${project_id}/${type}`),
        icon: "pi pi-home",
        style: {
          height: "21px",
        },
      }}
      model={breadcrumbs}
      style={{
        height: "50px",
      }}
    />
  );
}
