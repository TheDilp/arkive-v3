import { Icon } from "@iconify/react";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetDocuments } from "../../utils/customHooks";
import { supabaseStorageImagesLink } from "../../utils/utils";

type Props = {
  quickCreate: boolean;
  setQuickCreate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function QuickCreateNode({
  quickCreate,
  setQuickCreate,
}: Props) {
  const { project_id } = useParams();
  const { data: documents } = useGetDocuments(project_id as string);
  return (
    <Dialog
      header={() => (
        <div className="flex flex-wrap">
          Node from Document
          <span className="w-full text-sm font-medium text-gray-400">
            Drag onto the board to quickly create nodes
          </span>
        </div>
      )}
      className="w-30rem overflow-y-auto"
      visible={quickCreate}
      onHide={() => setQuickCreate(false)}
      modal={false}
      position="left"
      style={{
        height: "40rem",
      }}
    >
      <div className="flex flex-wrap row-gap-5 column-gap-6">
        {documents
          ?.filter((doc) => !doc.folder && !doc.template)
          .map((doc) => (
            <div
              key={doc.id}
              className="w-3"
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("text", doc.id);
              }}
            >
              <div className="p-0  text-center flex flex-wrap justify-content-center">
                {doc.image?.link ? (
                  <div className="folderPageImageContainer cursor-pointer w-5rem h-5rem">
                    <img
                      className="w-4rem h-4rem"
                      style={{
                        objectFit: "contain",
                      }}
                      alt={doc.title}
                      src={
                        doc.image?.link
                          ? supabaseStorageImagesLink + doc.image.link
                          : ""
                      }
                    />
                  </div>
                ) : (
                  <div className="cursor-pointer w-5rem h-5rem">
                    <Icon icon="mdi:file" className="w-full" fontSize={80} />
                  </div>
                )}
              </div>

              <h4 className="text-center my-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {doc.title}
              </h4>
            </div>
          ))}
      </div>
    </Dialog>
  );
}
