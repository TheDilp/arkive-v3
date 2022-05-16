import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import {
  iconSelectProps,
  docItemDisplayDialogProps,
} from "../../../../custom-types";
import {
  useCreateDocument,
  useCreateTemplate,
  useGetTemplates,
} from "../../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { defaultTemplate } from "../../../../utils/utils";
import { InputText } from "primereact/inputtext";
type Props = {
  docId: string;
  setDocId: (docId: string) => void;
  setIconSelect: (iconSelect: iconSelectProps) => void;
  setDisplayDialog: (displayDialog: docItemDisplayDialogProps) => void;
  cm: any;
};

export default function TemplatesTree({
  docId,
  setDocId,
  setIconSelect,
  setDisplayDialog,
  cm,
}: Props) {
  const { project_id } = useParams();
  const parentRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const templates = useGetTemplates(project_id as string);
  const createDocumentMutation = useCreateTemplate();
  const [filter, setFilter] = useState("");
  const rowVirtualizer = useVirtual({
    size: templates.filter((template) =>
      filter ? template.title.includes(filter) : true
    ).length,
    parentRef,
    estimateSize: useCallback(() => 31, []),
    overscan: 5,
  });
  return (
    <div className="">
      <div className="w-full flex flex-wrap justify-content-center">
        <Button
          className="p-button-outlined my-2"
          label="New Template"
          icon="pi pi-copy"
          iconPos="right"
          onClick={() => {
            let id = uuid();
            createDocumentMutation.mutate({
              id,
              project_id: project_id as string,
              ...defaultTemplate,
            });
          }}
        />
        <InputText
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-1"
          placeholder="Filter by Title"
        />
      </div>
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
              className="hover:bg-blue-700 cursor-pointer Lato flex align-items-center"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `31px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              onClick={() => {
                setDocId(
                  templates.filter((template) =>
                    filter ? template.title.includes(filter) : true
                  )[virtualRow.index].id as string
                );
              }}
              onContextMenu={(e) => {
                cm.current.show(e);
                setDisplayDialog({
                  id: templates[virtualRow.index].id,
                  title: templates[virtualRow.index].title,
                  show: false,
                  folder: templates[virtualRow.index].folder,
                  template: templates[virtualRow.index].template,
                  depth: 0,
                });
              }}
            >
              <Icon
                icon={
                  templates.filter((template) =>
                    filter ? template.title.includes(filter) : true
                  )[virtualRow.index].icon
                }
                inline={true}
                className="mr-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIconSelect({
                    doc_id: templates.filter((template) =>
                      filter ? template.title.includes(filter) : true
                    )[virtualRow.index].id,
                    icon: "bxs:folder",
                    show: true,
                    top: e.clientY,
                    left: e.clientX,
                  });
                }}
              />
              <span
                className={`text-lg Lato ${
                  docId ===
                  templates.filter((template) =>
                    filter ? template.title.includes(filter) : true
                  )[virtualRow.index].id
                    ? "text-primary"
                    : ""
                }`}
              >
                {
                  templates.filter((template) =>
                    filter ? template.title.includes(filter) : true
                  )[virtualRow.index].title
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
