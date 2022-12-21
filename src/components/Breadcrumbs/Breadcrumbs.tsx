import { SetStateAction } from "jotai";
import { BreadCrumb } from "primereact/breadcrumb";
import { Dispatch, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { DocumentType } from "../../types/documentTypes";
import { AvailableItemTypes, BreadcrumbsType } from "../../types/generalTypes";

export default function Breadcrumbs({ type }: { type: AvailableItemTypes }) {
  const { project_id, item_id } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsType>([]);
  const { data: documents } = useGetAllItems(project_id as string, type);
  const { data: currentDocument } = useGetItem(item_id as string, type, { enabled: !!item_id }) as {
    data: DocumentType;
  };
  const navigate = useNavigate();
  function recursiveFindParents(
    parent_id: string | null,
    recursiveDocuments: DocumentType[],
    tempBreadcrumbs: BreadcrumbsType,
    setCrumbs: Dispatch<SetStateAction<BreadcrumbsType>>,
  ) {
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

      recursiveFindParents(parent.parent || null, recursiveDocuments, tempBreadcrumbs, setCrumbs);
    } else {
      const current = tempBreadcrumbs.shift();
      if (current) tempBreadcrumbs.push(current);
      setCrumbs(tempBreadcrumbs);
    }
  }

  useEffect(() => {
    if (documents && documents.length > 0) {
      if (currentDocument) {
        const tempBreadcrumbs: BreadcrumbsType = [
          {
            template: (
              <Link
                className="font-bold text-white"
                to={`/project/${project_id}/wiki/${currentDocument.folder ? "folder" : "doc"}/${currentDocument.id}`}>
                {currentDocument.title}
              </Link>
            ),
          },
        ];

        recursiveFindParents(currentDocument?.parent || null, documents as DocumentType[], tempBreadcrumbs, setBreadcrumbs);
      } else {
        setBreadcrumbs([]);
      }
    }
  }, [item_id, currentDocument]);

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
