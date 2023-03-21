/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllItems } from "../../../CRUD/ItemsCRUD";
import { baseURLS, createURLS } from "../../../types/CRUDenums";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { CardType } from "../../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
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
  const { data: documents, isLoading } = useGetAllItems<DocumentType>(project_id as string, "documents");
  return (
    <div className=" flex flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl font-medium">Add card</h2>

      <MultiSelect
        disabled={isLoading}
        display="chip"
        filter
        filterBy="title"
        onChange={(e) => setSelectedDocuments(e.value)}
        optionLabel="title"
        options={(documents || [])
          .filter(
            (doc) =>
              !doc.template &&
              !doc.folder &&
              (drawer?.data?.cards ? !drawer.data?.cards?.some((card: CardType) => card.documentsId === doc.id) : true),
          )
          .map((doc) => ({ id: doc.id, title: doc.title }))}
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
                selectedDocuments
                  .filter((doc) => !drawer?.data?.cards.some((card: CardType) => card.documentsId === doc.id))
                  .map((doc) => ({
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
        {buttonLabelWithIcon("Save", IconEnum.save)}
      </Button>
    </div>
  );
}
