import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useCallback, useContext, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVirtual } from "react-virtual";
import { v4 as uuid } from "uuid";
import {
  DocItemDisplayDialogProps,
  IconSelectProps,
} from "../../../../custom-types";
import {
  useCreateTemplate,
  useGetTemplates,
} from "../../../../utils/customHooks";
import { defaultTemplate } from "../../../../utils/utils";
import { ProjectContext } from "../../../Context/ProjectContext";
type Props = {
  setIconSelect: (iconSelect: IconSelectProps) => void;
  setDisplayDialog: (displayDialog: DocItemDisplayDialogProps) => void;
  cm: any;
};

export default function TemplatesTree({
  setIconSelect,
  setDisplayDialog,
  cm,
}: Props) {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const { id: docId, setId: setDocId } = useContext(ProjectContext);
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
          className="p-button-outlined my-2 w-full mx-2"
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
                navigate(
                  `doc/${
                    templates.filter((template) =>
                      filter ? template.title.includes(filter) : true
                    )[virtualRow.index].id
                  }`
                );
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
                  parent: templates[virtualRow.index].parent?.id || null,
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
                    id: templates.filter((template) =>
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
