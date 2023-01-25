import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SectionCard from "../../components/Card/SectionCard";
import { useSortMutation } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { ScreenType, SectionType } from "../../types/screenTypes";
import { SortIndexes } from "../../types/treeTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getSectionSizeClass } from "../../utils/screenUtils";

export default function ScreenView() {
  const { project_id, item_id } = useParams();
  const { data, isLoading } = useGetItem<ScreenType>(item_id as string, "screens");
  const sortSectionsMutation = useSortMutation(project_id as string, "sections");

  const [, setDrawer] = useAtom(DrawerAtom);

  const [sections, setSections] = useState<SectionType[]>(data?.sections || []);

  function updateCard(sectionId: string, cardId: string, expanded: boolean) {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            cards: section.cards.map((card) => {
              if (card.id === cardId) return { ...card, expanded };
              return card;
            }),
          };
        }
        return section;
      }),
    );
  }

  useEffect(() => {
    if (data?.sections) setSections(data?.sections);
  }, [data?.sections]);

  if (isLoading) return <ProgressSpinner />;
  return (
    <div className="flex min-h-full w-full flex-col gap-y-4 overflow-hidden p-4 pb-8">
      <div className="w-full">
        <Button
          className="p-button-outlined"
          icon="pi pi-plus"
          iconPos="right"
          label="New Section"
          onClick={() => setDrawer({ ...DefaultDrawer, position: "right", show: true, type: "sections" })}
        />
      </div>
      <div className="h-full w-full overflow-auto">
        <DragDropContext
          onDragEnd={(result) => {
            if (!result) return;
            const tempSections = [...sections];
            if (typeof result.destination?.index === "number" && result.source.index !== result.destination?.index) {
              const removedSection = tempSections.splice(result.source.index, 1);
              tempSections.splice(result.destination.index, 0, removedSection[0]);
              setSections(tempSections);
              const sortIndexes: SortIndexes = tempSections.map((section, index) => ({
                id: section.id,
                parentId: section.parentId,
                sort: index,
              }));
              sortSectionsMutation.mutate(sortIndexes);
            }
          }}>
          <Droppable direction="horizontal" droppableId="sceneDroppable">
            {(providedDroppable) => (
              <div ref={providedDroppable.innerRef} {...providedDroppable.droppableProps} className="flex gap-x-4">
                {sections?.length
                  ? sections?.map((section, sectionIndex) => (
                      <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                        {(provided, snapshot) => (
                          <div
                            key={section.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="scrollbar-hidden flex flex-col gap-y-2">
                            <h3
                              {...provided.dragHandleProps}
                              className={`text-Lato group flex ${getSectionSizeClass(
                                section.size,
                              )} select-none items-center rounded bg-zinc-800 p-1 text-center font-Lato text-xl font-medium`}>
                              <span className="flex-1 truncate">{section.title}</span>
                              <Tooltip content="Add card" position="bottom" target=".addCard" />
                              <Icon
                                className="addCard ml-auto w-min cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                                icon="mdi:plus"
                                onClick={() =>
                                  setDrawer({
                                    ...DefaultDrawer,
                                    data: section,
                                    position: "right",
                                    show: true,
                                    type: "cards",
                                  })
                                }
                              />
                              <Icon
                                className="ml-auto w-min cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                                icon="mdi:pencil"
                                onClick={() =>
                                  setDrawer({
                                    ...DefaultDrawer,
                                    data: section,
                                    position: "right",
                                    show: true,
                                    type: "sections",
                                  })
                                }
                              />
                            </h3>
                            {snapshot.isDragging ? null : (
                              <div className="flex w-full max-w-full flex-col gap-y-2">
                                {(section.cards || []).map((card) => (
                                  <SectionCard key={card.id} card={card} updateCard={updateCard} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  : null}

                <div className="w-[20rem]">{providedDroppable.placeholder}</div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
