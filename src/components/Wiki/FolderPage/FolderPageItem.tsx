import { Icon } from "@iconify/react";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  docItemDisplayDialogProps,
  DocumentProps,
} from "../../../custom-types";
import defaultImage from "../../../styles/DefaultProjectImage.jpg";
import { useUpdateDocument } from "../../../utils/customHooks";
import { supabaseStorageImagesLink } from "../../../utils/utils";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import { ProjectContext } from "../../Context/ProjectContext";

type Props = {
  doc: DocumentProps;
  cm: any;
  setDisplayDialog: (displayDialog: docItemDisplayDialogProps) => void;
};

export default function FolderPageItem({ doc, cm, setDisplayDialog }: Props) {
  const { project_id } = useParams();
  const { setId: setDocId } = useContext(ProjectContext);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const updateDocumentMutation = useUpdateDocument(project_id as string);

  return (
    <Link
      className={`${
        isLaptop ? "w-3" : isTabletOrMobile ? "w-4" : "w-1"
      } text-white no-underline px-2`}
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
        img.src = doc.image?.link || "";
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
              <Icon icon="mdi:folder" className="w-full" fontSize={80} />
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
                <Icon icon="mdi:file" className="w-full" fontSize={80} />
              )}
            </div>
          )}
          <h4 className="text-center my-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">
            {doc.title}
          </h4>
        </div>
      </div>
    </Link>
  );
}
