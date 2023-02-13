/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-bind */
import { Draggable, DraggableProvided, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { SetStateAction, useAtom } from "jotai";
import { Dispatch, useCallback } from "react";
import { useParams } from "react-router-dom";

import { useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { baseURLS, deleteURLs } from "../../types/CRUDenums";
import { CardType, SectionType } from "../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getSectionSizeClass } from "../../utils/screenUtils";
import SectionCard from "../Card/SectionCard";

type Props = {
  section: SectionType;
  providedSectionDraggable: DraggableProvided;
  sectionSize: string | undefined;
  setSections: Dispatch<SetStateAction<SectionType[]>>;
};

export default function ScreenSection({ section, providedSectionDraggable, sectionSize, setSections }: Props) {
  const { item_id } = useParams();
  const [, setDrawer] = useAtom(DrawerAtom);
  const updateSectionMutation = useUpdateSubItem<SectionType>(item_id as string, "sections", "screens");
  const updateCardMutation = useUpdateSubItem<CardType>(item_id as string, "cards", "screens");

  const updateCard = useCallback((sectionId: string, cardId: string, expanded: boolean) => {
    updateCardMutation.mutate({ id: cardId, expanded });
    setSections((prev) =>
      prev.map((prevSection) => {
        if (prevSection.id !== sectionId) return prevSection;
        return {
          ...prevSection,
          cards: prevSection.cards.map((card) => {
            if (card.id !== cardId) return card;
            return { ...card, expanded };
          }),
        };
      }),
    );
  }, []);
  const deleteCard = useCallback((id: string, sectionId: string) => {
    FetchFunction({ url: `${baseURLS.baseServer}${deleteURLs.deleteCard}${id}`, method: "DELETE" });
    setSections((prev) =>
      prev.map((prevSection) => {
        if (prevSection.id !== sectionId) return prevSection;
        return {
          ...prevSection,
          cards: prevSection.cards.filter((card) => card.id !== id),
        };
      }),
    );
  }, []);
  return (
    <div
      key={section.id}
      className="mx-1 flex flex-col"
      {...providedSectionDraggable.draggableProps}
      ref={providedSectionDraggable.innerRef}>
      <h3
        className="group mb-1 flex max-w-full items-center justify-between  rounded bg-zinc-800 py-1 px-2 font-Merriweather text-xl"
        {...providedSectionDraggable.dragHandleProps}
        onClick={() => updateSectionMutation.mutate({ id: section.id, expanded: !section.expanded })}>
        <span className="w-full truncate">{section.title}</span>
        <div className="item-center flex">
          <Icon
            className="cursor-pointer opacity-0 transition-all hover:text-sky-400 group-hover:opacity-100"
            icon="mdi:plus"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDrawer({ ...DefaultDrawer, show: true, type: "cards", data: section });
            }}
          />
          <Icon
            className="cursor-pointer opacity-0 transition-all hover:text-sky-400 group-hover:opacity-100"
            icon="mdi:pencil"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDrawer({ ...DefaultDrawer, show: true, type: "sections", data: section });
            }}
          />
        </div>
      </h3>
      <Droppable direction="vertical" droppableId={section.id} type="CARD">
        {(droppableProvided, droppableSnapshot) => (
          <div
            className={`h-full max-w-min  ${getSectionSizeClass(sectionSize || "md")} ${
              droppableSnapshot.isDraggingOver ? "border border-dashed border-zinc-600" : ""
            }`}>
            <div
              ref={droppableProvided.innerRef}
              className="flex h-full max-w-full flex-col"
              {...droppableProvided.droppableProps}>
              <div className="scrollbar-hidden flex h-full max-w-full flex-col overflow-x-hidden ">
                {section?.cards
                  ? section.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(providedDraggable) => (
                          <div
                            className="my-1 w-full max-w-full"
                            {...providedDraggable.dragHandleProps}
                            {...providedDraggable.draggableProps}
                            ref={providedDraggable.innerRef}>
                            <SectionCard
                              card={card}
                              cardSize={section.cardSize}
                              deleteCard={deleteCard}
                              updateCard={updateCard}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  : null}
              </div>
            </div>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
