import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetAllDocuments } from "../../CRUD/DocumentCRUD";
import { useGetItem } from "../../hooks/getItemHook";
import { DocumentType } from "../../types/documentTypes";
import { BreadcrumbsType } from "../../types/generalTypes";

export default function Breadcrumbs() {
  const { project_id, item_id } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsType>([]);
  const { data: documents } = useGetAllDocuments(project_id as string);
  const currentDocument = useGetItem(project_id as string, item_id as string, "documents");
  const navigate = useNavigate();
  function recursiveFindParents(
    parent_id: string | null,
    documents: DocumentType[],
    tempBreadcrumbs: BreadcrumbsType,
    setBreadcrumbs: (breadcrumbs: BreadcrumbsType) => void,
  ) {
    const parent = documents.find((doc) => doc.id === parent_id);
    if (parent) {
      tempBreadcrumbs.push({
        template: (
          <Link
            className="text-white fontWeight700"
            to={`/project/${project_id}/wiki/${parent.folder ? "folder" : "doc"}/${parent.id}`}>
            {parent.title}
          </Link>
        ),
      });

      recursiveFindParents(parent.parent || null, documents, tempBreadcrumbs, setBreadcrumbs);
    } else {
      const current = tempBreadcrumbs.shift();
      if (current) tempBreadcrumbs.push(current);
      setBreadcrumbs(tempBreadcrumbs);
      return;
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

        recursiveFindParents(currentDocument?.parent || null, documents, tempBreadcrumbs, setBreadcrumbs);
      }
    }
  }, [item_id]);

  return (
    <BreadCrumb
      model={breadcrumbs}
      home={{
        className: "flex",
        command: () => navigate("../"),
        icon: "pi pi-home",
        style: {
          height: "21px",
        },
      }}
      className="w-full font-bold bg-transparent border-none border-bottom-2 border-noround z-5"
      style={{
        height: "50px",
      }}
    />
  );
}
