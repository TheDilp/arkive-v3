import { Card } from "primereact/card";
import { useParams } from "react-router-dom";
import { DocumentProps } from "../../../custom-types";
import { useGetDocuments } from "../../../utils/customHooks";
import { HoverTooltip } from "../Editor/LinkHover/HoverTooltip";
import LinkHoverEditor from "../Editor/LinkHover/LinkHoverEditor";

export default function FolderPage() {
  const { project_id, doc_id } = useParams();

  const { data: documents } = useGetDocuments(project_id as string);

  function recursiveRenderFolder(
    documents: DocumentProps[],
    folder_id: string
  ) {
    return (
      <ul key={folder_id}>
        {documents
          .filter((doc) => doc.parent?.id === folder_id)
          .sort((a, b) => {
            if (a.folder && !b.folder) return -1;
            if (!a.folder && b.folder) return 1;
            return 0;
          })
          .map((doc) => (
            <li key={doc.id}>
              <h4>{doc.title} BBB</h4>
              {doc.folder && recursiveRenderFolder(documents, doc.id)}
            </li>
          ))}
      </ul>
    );
  }

  return (
    <article className="text-white w-10 flex flex-wrap justify-content-start align-content-start">
      <h1 className="Merriweather w-full">
        {documents?.filter((doc) => doc.id === doc_id)[0].title || "Folder"}
      </h1>
      <section className="w-full">
        <ul>
          {documents &&
            documents
              .filter((doc) => doc.parent?.id === doc_id)
              .map((doc) => {
                if (!doc.folder) {
                  return (
                    <li className="text-white no-underline" key={doc.id}>
                      <HoverTooltip
                        label={
                          <Card
                            title={
                              <div className="text-center p-0">{doc.title}</div>
                            }
                            className="w-1/3 h-full"
                          >
                            <LinkHoverEditor content={doc.content} />
                          </Card>
                        }
                      >
                        <h4>{doc.title}</h4>
                      </HoverTooltip>
                    </li>
                  );
                } else {
                  return (
                    <div>
                      <h4>{doc.title}</h4>
                      {recursiveRenderFolder(documents, doc.id)}
                    </div>
                  );
                }
              })}
        </ul>
      </section>
    </article>
  );
}
