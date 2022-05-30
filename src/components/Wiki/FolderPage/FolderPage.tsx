import { Icon } from "@iconify/react";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { DocumentProps } from "../../../custom-types";
import defaultImage from "../../../styles/DefaultProjectImage.jpg";
import {
  useGetDocumentData,
  useGetDocuments
} from "../../../utils/customHooks";
import { supabaseStorageImagesLink, toastWarn } from "../../../utils/utils";
import { ProjectContext } from "../../Context/ProjectContext";
import LoadingScreen from "../../Util/LoadingScreen";

export default function FolderPage() {
  const { project_id, doc_id } = useParams();
  const { id: docId, setId: setDocId } = useContext(ProjectContext);

  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const parent = useGetDocumentData(project_id as string, doc_id as string);

  const [children, setChildren] = useState<DocumentProps[]>([]);

  useEffect(() => {
    if (documents && documents.length > 0) {
      let tempChildren = documents
        .filter((doc) => doc.parent?.id === doc_id)
        .sort((a, b) => {
          if (a.folder && !b.folder) return -1;
          if (!a.folder && b.folder) return 1;
          return 0;
        });
      setChildren(tempChildren);
    }

    if (doc_id !== docId) setDocId(doc_id as string);
  }, [doc_id]);

  if (isLoading) return <LoadingScreen />;
  if (!parent) {
    toastWarn("Document not found");
    return <Navigate to={"../"} />;
  }
  return (
    <article className="text-white w-10 flex flex-wrap justify-content-start align-content-start">
      <h1 className="Merriweather w-full ml-7">{parent.title || "Folder"}</h1>
      <section className="Lato w-full h-full flex flex-wrap align-content-start row-gap-4 px-5 overflow-y-auto">
        {children &&
          (children.length > 0 ? (
            children.map((doc) => (
              <Link
                className="w-1 text-white no-underline"
                to={`../${doc.folder ? "folder" : "doc"}/${doc.id}`}
                key={doc.id}
                onClick={() => setDocId(doc.id)}
              >
                <div className="h-full p-surface-card folderPageImage ">
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
              <h3 className="text-gray-500">No files found</h3>
            </div>
          ))}
      </section>
    </article>
  );
}
