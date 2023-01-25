/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSubItem } from "../../../CRUD/ItemsCRUD";
import { baseURLS, createURLS } from "../../../types/CRUDenums";
import { DocumentType } from "../../../types/documentTypes";
import { CardType } from "../../../types/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { buttonLabelWithIcon } from "../../../utils/transform";
import { DocumentMentionTooltip } from "../../Mention/DocumentMention";
import { Tooltip } from "../../Tooltip/Tooltip";

export default function DrawerCardContent() {
  const { project_id, item_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer] = useAtom(DrawerAtom);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);
  const documents = queryClient.getQueryData<DocumentType[]>(["allItems", project_id, "documents"]);
  const createCardMutation = useCreateSubItem<CardType>(item_id as string, "cards", "screens");
  return (
    <div className=" flex flex-col gap-y-2">
      <h2 className="font-Lato text-2xl font-medium">Add card</h2>

      <MultiSelect
        display="chip"
        onChange={(e) => setSelectedDocuments(e.value)}
        optionLabel="title"
        options={(documents || []).filter((doc) => !doc.template && !doc.folder)}
        placeholder="Select a Document"
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
        onClick={async () => {
          if (drawer?.data?.id)
            FetchFunction({
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
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
