import { Icon } from "@iconify/react";
import { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { iconSelect } from "../../../../custom-types";
import { useGetTemplates } from "../../../../utils/customHooks";
type Props = {
  setDocId: (docId: string) => void;
  setIconSelect: (iconSelect: iconSelect) => void;
};

export default function TemplatesTree({ setDocId, setIconSelect }: Props) {
  const { project_id } = useParams();
  const templates = useGetTemplates(project_id as string);
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const rowVirtualizer = useVirtual({
    size: templates.length,
    parentRef,
    estimateSize: useCallback(() => 31, []),
    overscan: 5,
  });

  return (
    <div>
      <div
        ref={parentRef}
        className="h-screen list-none text-lg"
        style={{
          height: `100%`,
          width: `100%`,
          overflow: "auto",
          paddingLeft: 40,
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
            marginTop: "16px",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className="hover:bg-primary cursor-pointer Lato flex align-items-center"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `31px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              onClick={() => {
                setDocId(templates[virtualRow.index].id as string);
              }}
            >
              <Icon
                icon={templates[virtualRow.index].icon}
                inline={true}
                className="mr-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setIconSelect({
                    doc_id: templates[virtualRow.index].id,
                    icon: "bxs:folder",
                    show: true,
                    top: e.clientY,
                    left: e.clientX,
                  });
                }}
              />
              <span className={`text-lg hover:bg-blue-300 Lato`}>
                {templates[virtualRow.index].title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
