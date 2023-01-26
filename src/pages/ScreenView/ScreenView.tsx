/* eslint-disable react/jsx-no-bind */
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";

import SectionCard from "../../components/Card/SectionCard";
import { useGetItem } from "../../hooks/useGetItem";
import { ScreenType } from "../../types/screenTypes";
import { getSectionSizeClass } from "../../utils/screenUtils";

export default function ScreenView() {
  const { item_id } = useParams();
  const { data, isLoading } = useGetItem<ScreenType>(item_id as string, "screens");
  function onDragEnd(result) {}
  return (
    <div className="flex h-full gap-x-2 overflow-auto p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {!isLoading ? (
          data?.sections.map((section) => (
            <Droppable key={section.id} droppableId={section.id}>
              {(provided) => (
                <div className={`max-w-min ${getSectionSizeClass(section.size)}`}>
                  <div ref={provided.innerRef} className="flex h-full max-w-full flex-col" {...provided.droppableProps}>
                    <h3 className="mb-1 max-w-full truncate rounded bg-zinc-800 py-1 px-2">{section.title}</h3>
                    <div className="scrollbar-hidden flex h-full max-w-full flex-col gap-y-2 overflow-x-hidden">
                      {section.cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(providedDraggable) => (
                            <div
                              className="w-full max-w-full"
                              {...providedDraggable.dragHandleProps}
                              {...providedDraggable.draggableProps}
                              ref={providedDraggable.innerRef}>
                              <SectionCard card={card} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))
        ) : (
          <ProgressSpinner />
        )}
      </DragDropContext>
    </div>
  );
}
