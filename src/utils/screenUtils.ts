import { DropResult } from "@hello-pangea/dnd";
import { QueryClient } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import set from "lodash.set";
import { Dispatch } from "react";

import { baseURLS, updateURLs } from "../types/CRUDenums";
import { ScreenType, SectionType } from "../types/ItemTypes/screenTypes";
import { FetchFunction } from "./CRUD/CRUDFetch";
import { toaster } from "./toast";

export const SectionSizeOptions = [
  {
    label: "Extra small",
    value: "xs",
  },
  {
    label: "Small",
    value: "sm",
  },
  {
    label: "Medium",
    value: "md",
  },
  {
    label: "Large",
    value: "lg",
  },
  {
    label: "Extra large",
    value: "xl",
  },
];

export const getSectionSizeClass = (size: string) => {
  if (size === "xs") return "min-w-[15rem] max-w-[15rem] w-[15rem]";
  if (size === "sm") return "min-w-[20rem] max-w-[20rem] w-[20rem]";
  if (size === "md") return "min-w-[25rem] max-w-[25rem] w-[25rem]";
  if (size === "lg") return "min-w-[30rem] max-w-[30rem] w-[30rem]";
  if (size === "xl") return "min-w-[35rem] max-w-[35rem] w-[35rem]";
  if (size === "xxl") return "min-w-[40rem] max-w-[40rem] w-[40rem]";
  return "min-w-[25rem] max-w-[25rem] w-[25rem]";
};
export const getCardSizeClass = (size: string) => {
  if (size === "xs") return "min-h-[15rem] max-h-[15rem] h-[15rem]";
  if (size === "sm") return "min-h-[20rem] max-h-[20rem] h-[20rem]";
  if (size === "md") return "min-h-[25rem] max-h-[25rem] h-[25rem]";
  if (size === "lg") return "min-h-[30rem] max-h-[30rem] h-[30rem]";
  if (size === "xl") return "min-h-[35rem] max-h-[35rem] h-[35rem]";
  if (size === "xxl") return "min-h-[40rem] max-h-[40rem] h-[40rem]";
  return "min-h-[25rem] max-h-[25rem] h-[25rem]";
};

export function onDragEnd(
  result: DropResult,
  sections: SectionType[],
  setSections: Dispatch<SetStateAction<SectionType[]>>,
  queryClient: QueryClient,
  project_id: string,
  item_id: string,
) {
  const tempSections = [...sections];
  if (!result || !result.destination) return;
  if (result.type === "CARD") {
    const sourceIdx = tempSections.findIndex((section) => section.id === result.source.droppableId);
    const targetIdx = tempSections.findIndex((section) => section.id === result.destination?.droppableId);
    const cardIndex = tempSections[sourceIdx].cards.findIndex((card) => card.id === result.draggableId);

    const sourceSection = tempSections[sourceIdx];
    const movedCard = tempSections[sourceIdx].cards[cardIndex];
    if (typeof targetIdx === "number" && movedCard) {
      const { source, destination } = result;
      if (sourceIdx === targetIdx) {
        // Do something only if it is not placed in the exact same space
        if (typeof destination?.index === "number" && source.index !== destination?.index) {
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
        if (targetSection?.cards?.some((card) => card.documentsId === movedCard.documentsId)) {
          toaster("warning", "Sections cannot contain duplicate cards.");
          return;
        }
        set(
          sourceSection,
          "cards",
          sourceSection.cards.filter((card) => card.id !== result.draggableId),
        );

        targetSection.cards.splice(destination?.index || 0, 0, { ...movedCard, parentId: targetSection.id });

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
  } else if (result.type === "SECTION") {
    const { source, destination } = result;
    if (typeof source.index === "number" && typeof destination?.index === "number" && source.index !== destination.index) {
      const sourceSection = tempSections.find((section) => section.id === result.draggableId);
      if (sourceSection) {
        tempSections.splice(source.index, 1);
        tempSections.splice(destination.index, 0, sourceSection);
        queryClient.setQueryData<ScreenType>(["screens", item_id], (oldData) => {
          if (oldData)
            return {
              ...oldData,
              sections: tempSections.map((section, index) => ({ ...section, sort: index })),
            };

          return oldData;
        });

        FetchFunction({
          url: `${baseURLS.baseServer}${updateURLs.sortSections}`,
          method: "POST",
          body: JSON.stringify(
            tempSections.map((section, index) => ({ id: section.id, parentId: section.parentId, sort: index })),
          ),
        });
        setSections(tempSections);
      }
    }
  }
}
