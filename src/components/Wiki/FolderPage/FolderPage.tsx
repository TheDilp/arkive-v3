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
import Breadcrumbs from "./Breadcrumbs";
import FolderPageItem from "./FolderPageItem";

export default function FolderPage() {
  const { project_id, doc_id } = useParams();
  const [children, setChildren] = useState<DocumentProps[]>([]);
  const [displayDialog, setDisplayDialog] = useState<docItemDisplayDialogProps>(
    docItemDisplayDialogDefault
  );
  const cm = useRef() as any;
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const currentDocument = useGetDocumentData(
    project_id as string,
    doc_id as string
  );

  useEffect(() => {
    if (documents && documents.length > 0) {
      let tempChildren = documents
        .filter(
          (doc) =>
            (doc_id ? doc.parent?.id === doc_id : doc.parent === null) &&
            !doc.template
        )
        .sort((a, b) => {
          if (a.folder && !b.folder) return -1;
          if (!a.folder && b.folder) return 1;
          return 0;
        });
      setChildren(tempChildren);
    }

    if (doc_id !== docId) setDocId(doc_id as string);
  }, [doc_id, documents]);

  if (isLoading) return <LoadingScreen />;
  if (!currentDocument && doc_id) {
    toastWarn("Document not found");
    return <Navigate to={"../"} />;
  }

  return (
    <article
      className={`text-white h-screen ${
        isTabletOrMobile ? "w-full" : isLaptop ? "w-9" : "w-10"
      } flex flex-wrap justify-content-start align-content-start`}
      onContextMenu={(e) => {
        setDisplayDialog({ ...displayDialog, root: true });
        cm.current.show(e);
      }}
    >
      <Breadcrumbs currentDocument={currentDocument} />
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
          {currentDocument && doc_id ? currentDocument.title : "Root Folder"}
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
