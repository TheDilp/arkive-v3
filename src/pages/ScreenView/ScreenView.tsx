import { Icon } from "@iconify/react";
import set from "lodash.set";
import { useState } from "react";
import { useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import { useGetItem } from "../../hooks/useGetItem";
import { ScreenType } from "../../types/screenTypes";

export default function ScreenView() {
  const { project_id, item_id } = useParams();
  const { data } = useGetItem<ScreenType>(item_id as string, "screens");

  return (
    <div className="flex overflow-hidden p-4 pb-8">
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
