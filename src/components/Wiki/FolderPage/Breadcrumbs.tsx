import { BreadCrumb } from "primereact/breadcrumb";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { breadcrumbsProps, DocumentProps } from "../../../custom-types";
import { useGetDocuments } from "../../../utils/customHooks";

type Props = {
  currentDocument?: DocumentProps | null;
};

export default function Breadcrumbs({ currentDocument }: Props) {
  const { project_id, doc_id } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState<breadcrumbsProps>([]);
  const { data: documents } = useGetDocuments(project_id as string);
  const navigate = useNavigate();
  function recursiveFindParents(
    parent_id: string | null,
    documents: DocumentProps[],
    tempBreadcrumbs: breadcrumbsProps,
    setBreadcrumbs: (breadcrumbs: breadcrumbsProps) => void
  ) {
    let parent = documents.find((doc) => doc.id === parent_id);
    if (parent) {
      tempBreadcrumbs.push({
        template: (
          <Link
            className="text-white fontWeight700"
            to={`/project/${project_id}/wiki/${
              parent.folder ? "folder" : "doc"
            }/${parent.id}`}
          >
            {parent.title}
          </Link>
        ),
      });

      recursiveFindParents(
        parent.parent?.id || null,
        documents,
        tempBreadcrumbs,
        setBreadcrumbs
      );
    } else {
      let current = tempBreadcrumbs.shift();
      if (current) tempBreadcrumbs.push(current);
      setBreadcrumbs(tempBreadcrumbs);
      return;
    }
  }

  useEffect(() => {
    if (documents && documents.length > 0) {
      if (currentDocument) {
        let tempBreadcrumbs: breadcrumbsProps = [
          {
            template: (
              <Link
                className="text-white fontWeight700"
                to={`/project/${project_id}/wiki/${
                  currentDocument.folder ? "folder" : "doc"
                }/${currentDocument.id}`}
              >
                {currentDocument.title}
              </Link>
            ),
          },
        ];

        recursiveFindParents(
          currentDocument?.parent?.id || null,
          documents,
          tempBreadcrumbs,
          setBreadcrumbs
        );
      }
    }
  }, [doc_id]);

  return (
    <BreadCrumb
      model={breadcrumbs}
      home={{
        icon: "pi pi-home",
        command: () => navigate("../"),
        className: "flex",
        style: {
          height: "21px",
        },
      }}
      className="w-full border-none border-bottom-2 border-noround"
      style={{
        height: "50px",
      }}
    />
  );
}
