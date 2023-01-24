import { Icon } from "@iconify/react";
import set from "lodash.set";
import { Button } from "primereact/button";
import { useState } from "react";
import { useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import { useCreateItem, useCreateSubItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { ScreenType, SectionType } from "../../types/screenTypes";
import { DefaultSection } from "../../utils/DefaultValues/ScreenDefaults";

export default function ScreenView() {
  const { item_id } = useParams();
  const { data } = useGetItem<ScreenType>(item_id as string, "screens");
  const { mutate } = useCreateSubItem<SectionType>(item_id as string, "sections", "screens");
  return (
    <div className="flex flex-col gap-y-4 overflow-hidden p-4 pb-8">
      <div className="w-full">
        <Button
          className="p-button-outlined"
          icon="pi pi-plus"
          iconPos="right"
          label="New Section"
          onClick={() => mutate({ id: crypto.randomUUID(), parentId: item_id as string, ...DefaultSection })}
        />
      </div>
      <div className="flex w-[calc(100vw-30rem)] max-w-full flex-1 gap-x-4 overflow-x-auto overflow-y-hidden pb-8">
        {data?.sections
          ? data?.sections?.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="scrollbar-hidden flex min-w-[20rem] max-w-xs flex-1 flex-col gap-y-2 overflow-y-auto">
                <h3 className="text-Lato select-none rounded p-1 text-center font-Lato text-2xl font-medium underline">
                  {section.title}
                </h3>
                <div className="flex w-full max-w-full flex-col gap-y-4">
                  {(section.cards || []).map((card, cardIndex) => (
                    <div key={card.id} className="w-full rounded-sm bg-zinc-800">
                      <h4 className="flex items-center justify-center gap-x-2 py-2 text-xl">
                        <span className="ml-auto select-none">{card.title}</span>
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
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
