/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { baseURLS, createURLS } from "../../../types/CRUDenums";
import { DocumentType } from "../../../types/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { toaster } from "../../../utils/toast";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { DocumentMentionTooltip } from "../../Mention/DocumentMention";
import { Tooltip } from "../../Tooltip/Tooltip";
import { handleCloseDrawer } from "../Drawer";

export default function DrawerCardContent() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);
  const documents = queryClient.getQueryData<DocumentType[]>(["allItems", project_id, "documents"]);
  return (
    <div className=" flex flex-col gap-y-2">
      <h2 className="font-Lato text-2xl font-medium">Add card</h2>

      <MultiSelect
        display="chip"
        onChange={(e) => setSelectedDocuments(e.value)}
        optionLabel="title"
        options={(documents || []).filter((doc) => !doc.template && !doc.folder)}
        placeholder="Select documents"
        value={selectedDocuments}
      />
      <div className="flex flex-wrap gap-2">
        {selectedDocuments.map((doc) => (
          <Tooltip key={doc.id} content={<DocumentMentionTooltip id={doc.id} title={doc.title} />} disabled={false}>
            <div>
              <Tag className="group flex cursor-pointer select-none items-center justify-between font-Lato">{doc.title}</Tag>
            </div>
          </Tooltip>
        ))}
      </div>
      <Button
        className="p-button-outlined p-button-success ml-auto"
        loading={loading}
        onClick={async () => {
          if (drawer?.data?.id) {
            setLoading(true);

            await FetchFunction({
              url: `${baseURLS.baseServer}${createURLS.createCard}`,
              method: "POST",
              body: JSON.stringify(
                selectedDocuments.map((doc) => ({
                  id: crypto.randomUUID(),
                  documentsId: doc.id,
                  parentId: drawer.data?.id,
                })),
              ),
            });
            await queryClient.refetchQueries({ queryKey: ["screens", drawer.data?.parentId] });
            toaster(
              "success",
              `Successfully added ${selectedDocuments.length} ${
                selectedDocuments.length === 1 ? "card" : "cards"
              }  to section "${drawer.data?.title ?? ""}."`,
            );
            setLoading(false);
            handleCloseDrawer(setDrawer, "right");
          }
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
