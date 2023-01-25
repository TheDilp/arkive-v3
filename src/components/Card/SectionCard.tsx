import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";

import { useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { CardType } from "../../types/screenTypes";
import { toaster } from "../../utils/toast";
import StaticRender from "../Editor/StaticRender";

type Props = {
  card: CardType;
  updateCard: (sectionId: string, cardId: string, expanded: boolean) => void;
};

export default function SectionCard({ card, updateCard }: Props) {
  const { item_id } = useParams();
  const updateSubItemMutation = useUpdateSubItem<CardType>(item_id as string, "cards", "screens");
  return (
    <div key={card.id} className="w-full rounded-sm bg-zinc-700">
      <h4 className="flex items-center justify-center gap-x-2 py-2 text-xl">
        <span className="ml-auto select-none">{card.document.title}</span>
        <Icon
          className="ml-auto cursor-pointer"
          fontSize={28}
          icon={`mdi:chevron-${card.expanded ? "up" : "down"}`}
          onClick={() => {
            updateCard(card.parentId, card.id, !card.expanded);
            updateSubItemMutation.mutate(
              { id: card.id, expanded: !card.expanded },
              {
                onError: () => {
                  toaster("error", "There was an error updating the card.");
                  updateCard(card.parentId, card.id, card.expanded);
                },
              },
            );
          }}
        />
      </h4>
      {card?.expanded ? (
        <div className="max-h-64 overflow-auto">
          {card?.document?.content ? <StaticRender content={card.document.content} /> : null}
        </div>
      ) : null}
    </div>
  );
}
