import { Icon } from "@iconify/react";

import { CardType } from "../../types/screenTypes";
import StaticRender from "../Editor/StaticRender";

type Props = {
  card: CardType;
  updateCard: (sectionId: string, cardId: string, expanded: boolean) => void;
};

export default function SectionCard({ card, updateCard }: Props) {
  return (
    <div key={card.id} className="w-full max-w-full rounded-sm bg-zinc-700">
      <h4 className="flex h-10 items-center justify-center gap-x-2 py-2 font-Lato text-lg ">
        <span className="ml-auto select-none">{card.document.title}</span>
        <Icon
          className="ml-auto cursor-pointer"
          fontSize={28}
          icon={`mdi:chevron-${card.expanded ? "up" : "down"}`}
          onClick={() => {
            updateCard(card.parentId, card.id, !card.expanded);
          }}
        />
      </h4>
      {card?.expanded ? (
        <div className="max-h-64 overflow-auto border-t border-zinc-600">
          {card?.document?.content ? <StaticRender content={card.document.content} /> : null}
        </div>
      ) : null}
    </div>
  );
}
