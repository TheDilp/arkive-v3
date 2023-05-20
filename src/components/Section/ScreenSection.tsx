/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-bind */
import { Draggable, DraggableProvided, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { SetStateAction, useAtom, useSetAtom } from "jotai";
import { Dispatch, useCallback } from "react";
import { useParams } from "react-router-dom";

import { updateSection } from "../../pages/ScreenView/ScreenView";
import { baseURLS, deleteURLs } from "../../types/CRUDenums";
import { ScreenType, SectionType } from "../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { getSectionSizeClass } from "../../utils/screenUtils";
import { getItem } from "../../utils/storage";
import { setExpanded } from "../../utils/uiUtils";
import SectionCard from "../Card/SectionCard";

type Props = {
  section: SectionType;
  providedSectionDraggable: DraggableProvided;
  sectionSize: string | undefined;
  setSections: Dispatch<SetStateAction<SectionType[]>>;
  isReadOnly?: boolean;
};

export default function ScreenSection({ section, providedSectionDraggable, sectionSize, setSections, isReadOnly }: Props) {
  const queryClient = useQueryClient();
  const { item_id } = useParams();
  const setDrawer = useSetAtom(DrawerAtom);

  const expandedCards = (getItem("cards-expanded") || []) as string[];

  const updateCard = useCallback((sectionId: string, cardId: string, expanded: boolean) => {
    setExpanded("cards", cardId, expanded);
    setSections((prev) => {
      const newSections = prev.map((prevSection) => {
        if (prevSection.id !== sectionId) return prevSection;
        return {
          ...prevSection,
          cards: prevSection.cards.map((card) => {
            if (card.id !== cardId) return card;
            return { ...card, expanded: !expanded };
          }),
        };
      });
      queryClient.setQueryData<ScreenType>(["screens", item_id], (oldData) => {
        if (oldData) return { ...oldData, sections: newSections };
        return oldData;
      });
      return newSections;
    });
  }, []);
  const deleteCard = useCallback((id: string, sectionId: string) => {
    FetchFunction({ url: `${baseURLS.baseServer}${deleteURLs.deleteCard}`, body: JSON.stringify({ id }), method: "DELETE" });
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
        className="group mb-1 flex max-w-full items-center justify-between rounded bg-zinc-800 py-1 px-2 font-Merriweather text-xl"
        {...providedSectionDraggable.dragHandleProps}
        onClick={() => {
          if (isReadOnly) return;
          updateSection(setSections, section.id, section.expanded);
        }}>
        <span className="w-full truncate">{section.title}</span>
        {isReadOnly ? null : (
          <div className="item-center flex">
            <Icon
              className="cursor-pointer opacity-0 transition-all hover:text-sky-400 group-hover:opacity-100"
              icon={IconEnum.edit}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrawer({ ...DefaultDrawer, show: true, type: "sections", data: section });
              }}
            />
            <Icon
              className="cursor-pointer opacity-0 transition-all hover:text-sky-400 group-hover:opacity-100"
              icon={IconEnum.add}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrawer({ ...DefaultDrawer, show: true, type: "cards", data: section });
              }}
            />
          </div>
        )}
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
                      <Draggable key={card.id} draggableId={card.id} index={index} isDragDisabled={!!isReadOnly}>
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
                              isExpanded={expandedCards.includes(card.id)}
                              isReadOnly={isReadOnly}
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
