import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  breadcrumbsProps,
  docItemDisplayDialogProps,
  DocumentProps,
} from "../../../custom-types";
import {
  useGetDocumentData,
  useGetDocuments,
} from "../../../utils/customHooks";
import { docItemDisplayDialogDefault } from "../../../utils/defaultDisplayValues";
import { toastWarn } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import { ProjectContext } from "../../Context/ProjectContext";
import LoadingScreen from "../../Util/LoadingScreen";
import DocumentTreeItemContext from "../DocumentTree/DocumentTreeItemContext";
import DocumentUpdateDialog from "../DocumentTree/DocumentUpdateDialog";
import FolderPageItem from "./FolderPageItem";

export default function FolderPage() {
  const { project_id, doc_id } = useParams();
  const navigate = useNavigate();
  const [children, setChildren] = useState<DocumentProps[]>([]);
  const [displayDialog, setDisplayDialog] = useState<docItemDisplayDialogProps>(
    docItemDisplayDialogDefault
  );
  const [breadcrumbs, setBreadcrumbs] = useState<breadcrumbsProps>([]);
  const cm = useRef() as any;
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );

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
      let tempChildren = documents
        .filter((doc) => doc.parent?.id === doc_id)
        .sort((a, b) => {
          if (a.folder && !b.folder) return -1;
          if (!a.folder && b.folder) return 1;
          return 0;
        });

      if (currentDocument) {
        let tempBreadcrumbs: {
          label: string;
          url: string;
          template: React.ReactNode;
        }[] = [
          {
            label: currentDocument.title,
            url: `/project/${project_id}/wiki/${
              currentDocument.folder ? "folder" : "doc"
            }/${doc_id}`,
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

      setChildren(tempChildren);
    }

    if (doc_id !== docId) setDocId(doc_id as string);
  }, [doc_id, documents]);

  if (isLoading) return <LoadingScreen />;
  if (!currentDocument) {
    toastWarn("Document not found");
    return <Navigate to={"../"} />;
  }

  return (
    <article
      className={`text-white h-screen ${
        isTabletOrMobile ? "w-full" : isLaptop ? "w-9" : "w-10"
      } flex flex-wrap justify-content-start align-content-start`}
    >
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
      <DocumentTreeItemContext
        cm={cm}
        displayDialog={displayDialog}
        setDisplayDialog={setDisplayDialog}
      />
      {displayDialog.show && (
        <DocumentUpdateDialog
          displayDialog={displayDialog}
          setDisplayDialog={setDisplayDialog}
        />
      )}
      <section
        className={`Lato w-full h-full flex flex-wrap ${
          isTabletOrMobile ? "justify-content-between column-gap-2 " : ""
        } align-content-start align-items-center row-gap-4 px-5 overflow-y-auto`}
      >
        <h1 className="Merriweather w-full">
          {currentDocument.title || "Folder"}
        </h1>
        {children &&
          (children.length > 0 ? (
            children.map((doc) => (
              <FolderPageItem
                key={doc.id}
                doc={doc}
                cm={cm}
                setDisplayDialog={setDisplayDialog}
              />
            ))
          ) : (
            <div className="ml-5">
              <h3 className="text-gray-500">No files</h3>
            </div>
          ))}
      </section>
    </article>
  );
}
