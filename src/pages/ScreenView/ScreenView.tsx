/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-bind */
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../../components/Card/SectionCard";
import { useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { baseURLS, deleteURLs } from "../../types/CRUDenums";
import { CardType, ScreenType, SectionType } from "../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getSectionSizeClass, onDragEnd } from "../../utils/screenUtils";

export default function ScreenView() {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const { data, isLoading } = useGetItem<ScreenType>(item_id as string, "screens");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [, setDrawer] = useAtom(DrawerAtom);
  const updateSectionMutation = useUpdateSubItem<SectionType>(item_id as string, "sections", "screens");
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
  const deleteCard = useCallback((id: string, sectionId: string) => {
    FetchFunction({ url: `${baseURLS.baseServer}${deleteURLs.deleteCard}${id}`, method: "DELETE" });
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.filter((card) => card.id !== id),
        };
      }),
    );
  }, []);

  useEffect(() => {
    if (data?.sections) setSections(data.sections);
  }, [data, item_id]);
  return (
    <div className="flex h-full flex-col gap-y-2 overflow-hidden p-4">
      <div>
        <Button
          className="p-button-outlined"
          icon="pi pi-plus"
          iconPos="right"
          label="Create Section"
          onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "sections" })}
        />
      </div>
      <div className="flex h-full gap-x-2 overflow-hidden">
        {!isLoading ? (
          <DragDropContext
            onDragEnd={(result) => {
              onDragEnd(result, sections, setSections, queryClient, project_id as string, item_id as string);
            }}>
            <Droppable direction="horizontal" droppableId={data?.id || "screenDroppable"} type="SECTION">
              {(providedScreen) => (
                <div
                  className="flex w-full overflow-x-auto overflow-y-hidden"
                  {...providedScreen.droppableProps}
                  ref={providedScreen.innerRef}>
                  {sections?.map((section, sectionIndex) => (
                    <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                      {(providedSectionDraggable) =>
                        section.expanded ? (
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
                                  className={`h-full max-w-min  ${getSectionSizeClass(data?.sectionSize || "md")} ${
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
                                                  <SectionCard card={card} deleteCard={deleteCard} updateCard={updateCard} />
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
                        ) : (
                          <div
                            {...providedSectionDraggable.draggableProps}
                            ref={providedSectionDraggable.innerRef}
                            {...providedSectionDraggable.dragHandleProps}
                            className="text mx-1 w-10 bg-zinc-800"
                            onClick={() => updateSectionMutation.mutate({ id: section.id, expanded: !section.expanded })}>
                            <h3 className="mt-4 rotate-90 whitespace-nowrap font-Merriweather text-xl">{section.title}</h3>
                          </div>
                        )
                      }
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
