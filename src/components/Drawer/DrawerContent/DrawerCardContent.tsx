/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";

import { useCreateSubItem } from "../../../CRUD/ItemsCRUD";
import { DocumentType } from "../../../types/documentTypes";
import { CardType } from "../../../types/screenTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";

export default function DrawerCardContent() {
  const { project_id, item_id } = useParams();
  const queryClient = useQueryClient();
  const [drawer] = useAtom(DrawerAtom);
  const documents = queryClient.getQueryData<DocumentType[]>(["allItems", project_id, "documents"]);
  const createCardMutation = useCreateSubItem<CardType>(item_id as string, "cards", "screens");
  return (
    <div className=" flex flex-col gap-y-2">
      <h2 className="font-Lato text-2xl font-medium">Add card</h2>
      {(documents || [])
        .filter((doc) => !doc.template && !doc.folder)
        .map((doc) => (
          <div
            key={doc.id}
            className="group flex cursor-pointer select-none items-center justify-between font-Lato"
            onClick={() =>
              createCardMutation.mutate({
                id: crypto.randomUUID(),
                parentId: drawer.data?.id,
                documentsId: doc.id,
              })
            }>
            <div className="transition-colors group-hover:text-sky-400">{doc.title}</div>
            <Icon icon="mdi:plus" />
          </div>
        ))}
    </div>
  );
}
