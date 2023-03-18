import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import { CardType } from "../../types/ItemTypes/screenTypes";
import { deleteItem } from "../../utils/Confirms/Confirm";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { getCardSizeClass } from "../../utils/screenUtils";
import StaticRender from "../Editor/StaticRender";

type Props = {
  card: CardType;
  cardSize: string;
  updateCard: (sectionId: string, cardId: string, expanded: boolean) => void;
  deleteCard: (id: string, sectionId: string) => void;
};

export default function SectionCard({ card, deleteCard, updateCard, cardSize }: Props) {
  return (
    <div key={card.id} className="w-full max-w-full rounded-sm bg-zinc-700">
      <h4 className="group flex h-10 w-full items-center justify-between gap-x-2  py-2 font-Lato text-lg ">
        <span className="select-none truncate px-2">{card.document.title}</span>
        <div className="flex items-center">
          <Link to={`../../documents/${card.documentsId}`}>
            <Icon
              className="cursor-pointer opacity-0 transition-all group-hover:opacity-100"
              fontSize={20}
              icon={IconEnum.edit}
            />
          </Link>
          <Icon
            className="cursor-pointer opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
            fontSize={20}
            icon={IconEnum.trash}
            onClick={() => {
              deleteItem("Are you sure you want to delete this card?", () => deleteCard(card.id, card.parentId));
            }}
          />
          <Icon
            className="cursor-pointer"
            fontSize={28}
            icon={card.expanded ? IconEnum.chevron_up : IconEnum.chevron_down}
            onClick={() => {
              updateCard(card.parentId, card.id, !card.expanded);
            }}
          />
        </div>
      </h4>
      {card?.expanded ? (
        <div className={`${getCardSizeClass(cardSize)} overflow-auto border-t border-zinc-600`}>
          {card?.document?.content ? <StaticRender content={card.document.content} /> : null}
        </div>
      ) : null}
    </div>
  );
}
