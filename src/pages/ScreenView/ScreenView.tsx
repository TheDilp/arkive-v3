import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import { useSortMutation } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { ScreenType, SectionType } from "../../types/screenTypes";
import { SortIndexes } from "../../types/treeTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { getSectionSizeClass } from "../../utils/screenUtils";

export default function ScreenView() {
  const { project_id, item_id } = useParams();
  const { data } = useGetItem<ScreenType>(item_id as string, "screens");
  const sortSectionsMutation = useSortMutation(project_id as string, "sections");

  const [, setDrawer] = useAtom(DrawerAtom);

  const [sections, setSections] = useState<SectionType[]>(data?.sections || []);

  useEffect(() => {
    if (data?.sections) setSections(data?.sections);
  }, [data?.sections]);

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
                              <div className="flex w-full max-w-full flex-col gap-y-4">
                                TEST
                                {(section.cards || []).map((card) => (
                                  <div key={card.id} className="w-full rounded-sm bg-zinc-800">
                                    <h4 className="flex items-center justify-center gap-x-2 py-2 text-xl">
                                      {/* <span className="ml-auto select-none">{card?.title}</span> */}
                                      <Icon
                                        className="ml-auto cursor-pointer"
                                        fontSize={28}
                                        icon="mdi:chevron-up"
                                        // onClick={() => {
                                        //   const tempSections = [...data.sections];
                                        //   set(tempSections, `[${sectionIndex}].cards[${cardIndex}].expanded`, !card.expanded);
                                        //   setSections(tempSections);
                                        // }}
                                      />
                                    </h4>
                                    <div className="max-h-64 overflow-auto">
                                      {card?.document?.content ? <StaticRender content={card.document.content} /> : null}
                                    </div>
                                  </div>
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
