import { Icon } from "@iconify/react";
import { BreadCrumb } from "primereact/breadcrumb";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  breadcrumbsProps,
  docItemDisplayDialogProps,
  DocumentProps,
} from "../../../custom-types";
import defaultImage from "../../../styles/DefaultProjectImage.jpg";
import {
  useGetDocumentData,
  useGetDocuments,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { docItemDisplayDialogDefault } from "../../../utils/defaultDisplayValues";
import { supabaseStorageImagesLink, toastWarn } from "../../../utils/utils";
import { ProjectContext } from "../../Context/ProjectContext";
import LoadingScreen from "../../Util/LoadingScreen";
import DocumentTreeItemContext from "../DocumentTree/DocumentTreeItemContext";
import DocumentUpdateDialog from "../DocumentTree/DocumentUpdateDialog";

export default function FolderPage() {
  const { project_id, doc_id } = useParams();
  const [children, setChildren] = useState<DocumentProps[]>([]);
  const [displayDialog, setDisplayDialog] = useState<docItemDisplayDialogProps>(
    docItemDisplayDialogDefault
  );
  const [breadcrumbs, setBreadcrumbs] = useState<breadcrumbsProps>([]);
  const cm = useRef() as any;
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );
  const updateDocumentMutation = useUpdateDocument(project_id as string);

  function recursiveFindParents(
    parent_id: string | null,
    documents: DocumentProps[],
    tempBreadcrumbs: breadcrumbsProps,
    setBreadcrumbs: (breadcrumbs: breadcrumbsProps) => void
  ) {
    let parent = documents.find((doc) => doc.id === parent_id);
    if (parent) {
      tempBreadcrumbs.push({
        label: parent.title,

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

      let tempBreadcrumbs: {
        label: string;
        url: string;
        template: React.ReactNode;
      }[] = [];

      recursiveFindParents(
        currentDocument?.parent?.id || null,
        documents,
        tempBreadcrumbs,
        setBreadcrumbs
      );
      setChildren(tempChildren);
    }

    if (doc_id !== docId) setDocId(doc_id as string);
  }, [doc_id, documents]);

  if (isLoading) return <LoadingScreen />;
  if (!currentDocument) {
    toastWarn("Document not found");
    return <Navigate to={"../"} />;
  }

  const home = {
    icon: "pi pi-home",
    url: "../",
    template: (
      <Link
        className="text-white fontWeight700"
        to={`/project/${project_id}/wiki`}
      >
        <i className="pi pi-home"></i>
      </Link>
    ),
  };
  return (
    <article className="text-white w-10 flex flex-wrap justify-content-start align-content-start">
      <BreadCrumb
        model={breadcrumbs || []}
        home={home}
        className="w-full border-none"
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
      <h1 className="Merriweather w-full ml-7">
        {currentDocument.title || "Folder"}
      </h1>
      <section className="Lato w-full h-full flex flex-wrap align-content-start row-gap-4 px-5 overflow-y-auto">
        {children &&
          (children.length > 0 ? (
            children.map((doc) => (
              <Link
                className="w-1 text-white no-underline"
                to={`../${doc.folder ? "folder" : "doc"}/${doc.id}`}
                key={doc.id}
                onClick={() => setDocId(doc.id)}
                onContextMenu={(e) => {
                  setDisplayDialog({
                    id: doc.id,
                    title: doc.title,
                    folder: doc.folder,
                    parent: doc.parent?.id || "",
                    template: false,
                    show: false,
                    depth: 0,
                  });
                  cm.current.show(e);
                }}
                onDragStart={(e) => {
                  e.dataTransfer.setData("doc_id", doc.id);
                  let img = new Image();
                  img.src = doc.image?.link || defaultImage;
                  e.dataTransfer.setDragImage(img, 10, 10);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (doc.folder) {
                    e.preventDefault();
                    let doc_id = e.dataTransfer.getData("doc_id");

                    // Safeguard - can't drop folder into itself
                    if (doc_id === doc.id) return;
                    updateDocumentMutation.mutate({
                      id: doc_id,
                      parent: doc.id,
                    });
                  }
                }}
              >
                <div className="h-full p-surface-card folderPageImage">
                  <div className="w-full">
                    {doc.folder ? (
                      <div className="p-0">
                        <Icon
                          icon="mdi:folder"
                          className="w-full"
                          fontSize={80}
                        />
                      </div>
                    ) : (
                      <div className="p-0 text-center flex flex-wrap justify-content-center">
                        {doc.image?.link ? (
                          <div className="folderPageImageContainer">
                            <img
                              className="h-full"
                              style={{
                                objectFit: "contain",
                              }}
                              alt={doc.title}
                              src={
                                doc.image?.link
                                  ? supabaseStorageImagesLink + doc.image.link
                                  : defaultImage
                              }
                            />
                          </div>
                        ) : (
                          <Icon
                            icon="mdi:file"
                            className="w-full"
                            fontSize={80}
                          />
                        )}
                      </div>
                    )}
                    <h4 className="text-center my-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                      {doc.title}
                    </h4>
                  </div>
                </div>
              </Link>
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
