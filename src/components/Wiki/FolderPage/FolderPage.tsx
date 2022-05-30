import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";
import defaultImage from "../../../styles/DefaultProjectImage.jpg";
import { useGetDocuments } from "../../../utils/customHooks";
import { supabaseStorageLink } from "../../../utils/utils";

export default function FolderPage() {
  const { project_id, doc_id } = useParams();

  const { data: documents } = useGetDocuments(project_id as string);

  return (
    <article className="text-white w-10 flex flex-wrap justify-content-start align-content-start">
      <h1 className="Merriweather w-full ml-7">
        {documents?.filter((doc) => doc.id === doc_id)[0].title || "Folder"}
      </h1>
      <section className="Lato w-full h-full flex flex-wrap align-content-start row-gap-4 px-5 overflow-y-auto">
        {documents &&
          documents
            .filter((doc) => doc.parent?.id === doc_id)
            .sort((a, b) => {
              if (a.folder && !b.folder) return -1;
              if (!a.folder && b.folder) return 1;
              return 0;
            })
            .map((doc) => (
              <Link
                className="w-1 text-white no-underline"
                to={`../${doc.folder ? "folder" : "doc"}/${doc.id}`}
              >
                <div
                  className="h-full p-surface-card folderPageImage "
                  key={doc.id}
                >
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
                                  ? supabaseStorageLink + doc.image.link
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
            ))}
      </section>
    </article>
  );
}
