/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-bind */
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ScreenSection from "../../components/Section/ScreenSection";
import { useUpdateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { ScreenType, SectionType } from "../../types/ItemTypes/screenTypes";
import { DrawerAtom } from "../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { onDragEnd } from "../../utils/screenUtils";

type Props = {
  id?: string;
  isReadOnly?: boolean;
};

export default function ScreenView({ id, isReadOnly }: Props) {
  const queryClient = useQueryClient();
  const { project_id, item_id } = useParams();
  const { data, isLoading } = useGetItem<ScreenType>(id || (item_id as string), "screens");
  const [sections, setSections] = useState<SectionType[]>([]);
  const [, setDrawer] = useAtom(DrawerAtom);
  const updateSectionMutation = useUpdateSubItem<SectionType>(id || (item_id as string), "sections", "screens");
  useEffect(() => {
    if (data?.sections) setSections(data.sections);
  }, [data, id, item_id]);
  return (
    <div className="flex h-full flex-col gap-y-2 overflow-hidden p-4">
      {isReadOnly ? null : (
        <div>
          <Button
            className="p-button-outlined"
            icon="pi pi-plus"
            iconPos="right"
            label="Create Section"
            onClick={() => setDrawer({ ...DefaultDrawer, show: true, type: "sections" })}
          />
        </div>
      )}
      <div className="flex h-full gap-x-2 overflow-hidden">
        {!isLoading ? (
          <DragDropContext
            onDragEnd={(result) => {
              if (isReadOnly) return;
              onDragEnd(result, sections, setSections, queryClient, project_id as string, id || (item_id as string));
            }}>
            <Droppable direction="horizontal" droppableId={data?.id || "screenDroppable"} type="SECTION">
              {(providedScreen) => (
                <div
                  className="flex w-full overflow-x-auto overflow-y-hidden"
                  {...providedScreen.droppableProps}
                  ref={providedScreen.innerRef}>
                  {sections?.map((section, sectionIndex) => (
                    <Draggable key={section.id} draggableId={section.id} index={sectionIndex} isDragDisabled={!!isReadOnly}>
                      {(providedSectionDraggable) =>
                        section.expanded || isReadOnly ? (
                          <ScreenSection
                            isReadOnly={isReadOnly}
                            providedSectionDraggable={providedSectionDraggable}
                            section={section}
                            sectionSize={data?.sectionSize}
                            setSections={setSections}
                          />
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
