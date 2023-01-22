import { Icon } from "@iconify/react";
import set from "lodash.set";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StaticRender from "../../components/Editor/StaticRender";
import { useGetManyItems } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/documentTypes";

export default function ScreenView() {
  const { project_id } = useParams();
  const { data } = useGetManyItems<DocumentType>(project_id as string, "documents", [
    "0e5c615d-cd3e-4462-a9b4-709d3b140434",
    "060552e0-930a-457d-9dc4-91f4facb643d",
  ]);

  const [sections, setSections] = useState([
    {
      id: "1",
      title: "Non-rulers",
      cards: (data || [])?.map((item) => ({ ...item, expanded: true })),
    },
  ]);

  useEffect(() => {
    if (data) {
      setSections([
        {
          id: "1",
          title: "Important figures",
          cards: [{ ...data?.[1], expanded: true }],
        },
        {
          id: "2",
          title: "Pheagon rulers",
          cards: [
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
          ],
        },
        {
          id: "3",
          title: "Test",
          cards: [
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
          ],
        },
        {
          id: "4",
          title: "Test",
          cards: [
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
          ],
        },
        {
          id: "5",
          title: "Test",
          cards: [
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
          ],
        },
        {
          id: "6",
          title: "Test",
          cards: [
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
            { ...data?.[0], expanded: true },
          ],
        },
      ]);
    }
  }, [data]);

  return (
    <div className="flex overflow-hidden">
      <div className="flex max-w-full flex-1 gap-x-4 overflow-auto">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="flex min-w-[20rem] max-w-xs flex-1 flex-col gap-y-2 ">
            <h3 className="text-Lato select-none rounded p-1 text-center font-Lato text-2xl font-medium underline">
              {section.title}
            </h3>
            <div className="flex w-full max-w-full flex-col gap-y-4">
              {(section.cards || []).map((card, cardIndex) => (
                <div key={card.id} className="w-full bg-zinc-800">
                  <h4 className="flex items-center justify-center gap-x-2 py-2 text-xl">
                    <span className="ml-auto select-none">{card.title}</span>
                    <Icon
                      className="ml-auto cursor-pointer"
                      fontSize={28}
                      icon={`mdi:chevron-${card.expanded ? "up" : "down"}`}
                      onClick={() => {
                        const tempSections = [...sections];
                        set(tempSections, `[${sectionIndex}].cards[${cardIndex}].expanded`, !card.expanded);
                        setSections(tempSections);
                      }}
                    />
                  </h4>
                  {card?.expanded ? (
                    <div className="max-h-64 overflow-auto">
                      {card?.content ? <StaticRender content={card.content} /> : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
