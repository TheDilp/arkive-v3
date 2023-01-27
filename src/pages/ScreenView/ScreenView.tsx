/* eslint-disable react/jsx-no-bind */
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import set from "lodash.set";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../../components/Card/SectionCard";
import { useCreateSubItem, useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { baseURLS, updateURLs } from "../../types/CRUDenums";
import { CardType, ScreenType, SectionType } from "../../types/screenTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getSectionSizeClass } from "../../utils/screenUtils";

export default function ScreenView() {
  const { item_id } = useParams();
  const { data, isLoading } = useGetItem<ScreenType>(item_id as string, "screens");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [, setDrawer] = useAtom(DrawerAtom);
  const updateCardMutation = useUpdateSubItem<CardType>(item_id as string, "cards", "screens");
  const updateCard = useCallback((sectionId: string, cardId: string, expanded: boolean) => {
    updateCardMutation.mutate({ id: cardId, expanded });
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.map((card) => {
            if (card.id !== cardId) return card;
            return { ...card, expanded };
          }),
        };
      }),
    );
  }, []);

  function onDragEnd(result: DropResult) {
    const tempSections = [...sections];
    const sourceIdx = tempSections.findIndex((section) => section.id === result.source.droppableId);
    const targetIdx = tempSections.findIndex((section) => section.id === result.destination?.droppableId);
    const cardIndex = tempSections[sourceIdx].cards.findIndex((card) => card.id === result.draggableId);
    if (!result || cardIndex === -1) return;
    const sourceSection = tempSections[sourceIdx];
    const movedCard = tempSections[sourceIdx].cards[cardIndex];
    if (typeof targetIdx === "number" && movedCard) {
      const { source, destination } = result;
      if (sourceIdx === targetIdx) {
        // Do something only if it is not placed in the exact same space
        if (destination?.index && source.index !== destination?.index) {
          tempSections[sourceIdx].cards[cardIndex].sort = destination.index;
          tempSections[sourceIdx].cards.splice(cardIndex, 1);
          tempSections[sourceIdx].cards.splice(destination.index, 0, movedCard);

          setSections(tempSections);
          FetchFunction({
            url: `${baseURLS.baseServer}${updateURLs.sortCards}`,
            method: "POST",
            body: JSON.stringify(
              // Use the card's parentId because the card is moved within the same column (same parentId)
              tempSections[sourceIdx].cards.map((card, index) => ({ id: card.id, parentId: card.parentId, sort: index })),
            ),
          });
        }
      } else {
        const targetSection = tempSections[targetIdx];
        set(
          sourceSection,
          "cards",
          sourceSection.cards.filter((card) => card.id !== result.draggableId),
        );

        targetSection.cards.splice(destination?.index || 0, 0, movedCard);

        FetchFunction({
          url: `${baseURLS.baseServer}${updateURLs.sortCards}`,
          method: "POST",
          body: JSON.stringify(
            tempSections[targetIdx].cards.map((card, index) => ({
              id: card.id,
              // Change id because the card is moved to a different column but also sort at the same time
              parentId: tempSections[targetIdx].id,
              sort: index,
            })),
          ),
        });

        tempSections[sourceIdx] = sourceSection;
        tempSections[targetIdx] = targetSection;
        setSections(tempSections);
      }
    }
  }

  useEffect(() => {
    if (data?.sections) setSections(data.sections);
  }, [data]);

  return (
    <div className="flex h-full flex-col gap-y-2 overflow-hidden p-4">
      <div>
        <Button
          className="p-button-outlined"
          icon="pi pi-plus"
          iconPos="right"
          label="Create Section"
          onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "sections", data })}
        />
      </div>
      <div className="flex h-full gap-x-2 overflow-auto ">
        <DragDropContext onDragEnd={onDragEnd}>
          {!isLoading ? (
            sections?.map((section) => (
              <Droppable key={section.id} direction="vertical" droppableId={section.id}>
                {(droppableProvided, droppableSnapshot) => (
                  <div
                    className={`max-w-min ${getSectionSizeClass(data?.sectionSize || "md")} ${
                      droppableSnapshot.isDraggingOver ? "border border-dashed border-zinc-600" : ""
                    }`}>
                    <div
                      ref={droppableProvided.innerRef}
                      className="flex h-full max-w-full flex-col"
                      {...droppableProvided.droppableProps}>
                      <h3 className="group mb-1 flex max-w-full items-center justify-between truncate rounded bg-zinc-800 py-1 px-2 font-Merriweather text-xl">
                        <span>{section.title}</span>
                        <div className="item-center flex">
                          <Icon
                            className="cursor-pointer opacity-0 transition-all hover:text-sky-400 group-hover:opacity-100"
                            icon="mdi:plus"
                            onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "cards", data: section })}
                          />
                          <Icon
                            className="cursor-pointer opacity-0 transition-all hover:text-sky-400 group-hover:opacity-100"
                            icon="mdi:pencil"
                            onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "sections", data: section })}
                          />
                        </div>
                      </h3>
                      <div className="scrollbar-hidden flex h-full max-w-full flex-col gap-y-2 overflow-x-hidden">
                        {section?.cards
                          ? section.cards.map((card, index) => (
                              <Draggable key={card.id} draggableId={card.id} index={index}>
                                {(providedDraggable, draggableSnapshot) => (
                                  <div
                                    className={`${
                                      draggableSnapshot.isDragging ? " bg-blue-300 " : "w-full max-w-full"
                                    } transition-all`}
                                    style={{
                                      maxWidth: "15rem",
                                    }}
                                    {...providedDraggable.dragHandleProps}
                                    {...providedDraggable.draggableProps}
                                    ref={providedDraggable.innerRef}>
                                    <SectionCard card={card} updateCard={updateCard} />
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
            ))
          ) : (
            <ProgressSpinner />
          )}
        </DragDropContext>
      </div>
    </div>
  );
}
