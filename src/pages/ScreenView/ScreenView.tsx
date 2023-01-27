/* eslint-disable react/jsx-no-bind */
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../../components/Card/SectionCard";
import { useSortMutation, useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { CardType, ScreenType, SectionType } from "../../types/screenTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getSectionSizeClass, onDragEnd } from "../../utils/screenUtils";

export default function ScreenView() {
  const { project_id, item_id } = useParams();
  const { data, isLoading } = useGetItem<ScreenType>(item_id as string, "screens");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [, setDrawer] = useAtom(DrawerAtom);
  const updateCardMutation = useUpdateSubItem<CardType>(item_id as string, "cards", "screens");
  const sortSectionsMutation = useSortMutation(project_id as string, "sections");

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
        {!isLoading ? (
          <DragDropContext onDragEnd={(result) => onDragEnd(result, sections, setSections, sortSectionsMutation)}>
            <Droppable direction="horizontal" droppableId={data?.id || "screenDroppable"} type="SECTION">
              {(providedScreen) => (
                <div className="flex w-full gap-x-2" {...providedScreen.droppableProps} ref={providedScreen.innerRef}>
                  {sections?.map((section, sectionIndex) => (
                    <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                      {(providedSectionDraggable) => (
                        <div
                          key={section.id}
                          className="h-full"
                          {...providedSectionDraggable.draggableProps}
                          ref={providedSectionDraggable.innerRef}>
                          <h3
                            className="group mb-1 flex max-w-full items-center justify-between truncate rounded bg-zinc-800 py-1 px-2 font-Merriweather text-xl"
                            {...providedSectionDraggable.dragHandleProps}>
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
                          <Droppable direction="vertical" droppableId={section.id} type="CARD">
                            {(droppableProvided, droppableSnapshot) => (
                              <div
                                className={`max-w-min ${getSectionSizeClass(data?.sectionSize || "md")} ${
                                  droppableSnapshot.isDraggingOver ? "border border-dashed border-zinc-600" : ""
                                }`}>
                                <div
                                  ref={droppableProvided.innerRef}
                                  className="flex h-full max-w-full flex-col"
                                  {...droppableProvided.droppableProps}>
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {providedScreen.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <ProgressSpinner />
        )}
      </div>
    </div>
  );
}
