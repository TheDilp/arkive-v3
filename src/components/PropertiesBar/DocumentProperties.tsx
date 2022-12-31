import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { Image } from "primereact/image";
import { useParams } from "react-router-dom";

import { useGetAllImages, useUpdateItem } from "../../CRUD/ItemsCRUD";
import { useGetItem } from "../../hooks/useGetItem";
import { baseURLS, getURLS } from "../../types/CRUDenums";
import { DocumentType } from "../../types/documentTypes";
import { toaster } from "../../utils/toast";
import { ImageDropdownItem } from "../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../Dropdown/ImageDropdownValue";
import Tags from "../Tags/Tags";

function DocumentOptionsHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-x-2">
      <Icon fontSize={22} icon={icon} /> {title}
    </div>
  );
}
export default function DocumentProperties() {
  const { project_id, item_id } = useParams();
  const { data: currentDocument } = useGetItem(item_id as string, "documents") as { data: DocumentType };
  const { data: images } = useGetAllImages(project_id as string);
  const queryClient = useQueryClient();

  const updateDocumentMutation = useUpdateItem("documents", project_id as string);

  const handleAlterNamesChange = (value: string[]) => {
    if (currentDocument) {
      updateDocumentMutation?.mutate(
        {
          alter_names: value,
          id: currentDocument.id,
        },
        {
          onSuccess: () => {
            queryClient.setQueryData(["allItems", project_id, "documents"], (oldData: DocumentType[] | undefined) => {
              if (oldData)
                return oldData.map((item) => {
                  if (item.id === currentDocument.id) return { ...item, alter_names: value };
                  return item;
                });
              return oldData;
            });
          },
        },
      );
    }
  };
  const handlePublicChange = (checked: boolean) => {
    if (currentDocument)
      updateDocumentMutation?.mutate(
        {
          id: currentDocument.id as string,
          isPublic: checked,
        },
        {
          onSuccess: () => {
            queryClient.setQueryData(["allItems", project_id, "documents"], (oldData: DocumentType[] | undefined) => {
              if (oldData)
                return oldData.map((item) => {
                  if (item.id === currentDocument.id) return { ...item, isPublic: checked };
                  return item;
                });
              return oldData;
            });
            toaster("info", `Document changed to ${checked ? "PUBLIC" : "PRIVATE"}.`);
          },
        },
      );
  };

  return (
    <span className="p-fluid propertiesBar overflow-hidden">
      <Chips
        allowDuplicate={false}
        className="alterNamesChips box-border max-h-40 min-h-[48px] w-full max-w-full border-l border-zinc-600"
        max={5}
        onChange={(e) => {
          const { value } = e;
          handleAlterNamesChange(value);
        }}
        placeholder="Alternative names (5 max)"
        value={currentDocument?.alter_names}
      />
      <Tags
        handleChange={({ value }) =>
          updateDocumentMutation?.mutate(
            {
              id: currentDocument.id,
              tags: value,
            },
            {
              onSuccess: () => {
                queryClient.refetchQueries({ queryKey: ["allTags", project_id, "documents"] });
              },
            },
          )
        }
        localItem={currentDocument}
        type="documents"
      />

      <Accordion>
        <AccordionTab headerTemplate={() => DocumentOptionsHeader({ icon: "mdi:image", title: "Image" })}>
          <Image preview src={`${baseURLS.baseServer}${getURLS.getSingleImage}${project_id}/${currentDocument?.image}`} />
          <Dropdown
            itemTemplate={ImageDropdownItem}
            onChange={(e) => updateDocumentMutation?.mutate({ id: currentDocument?.id, image: e.value })}
            options={images || []}
            placeholder="Select map"
            value={currentDocument?.image}
            valueTemplate={ImageDropdownValue({ image: currentDocument?.image })}
          />
        </AccordionTab>
        <AccordionTab headerTemplate={() => DocumentOptionsHeader({ icon: "mdi:cog", title: "Settings" })}>
          {!currentDocument?.template ? (
            <div className="flex w-full flex-nowrap items-center justify-between">
              <span className="mx-2">Public:</span>
              <Checkbox
                checked={currentDocument?.isPublic}
                onChange={(e) => handlePublicChange(e.checked)}
                tooltip="If checked, anyone can access the content via a public page"
                tooltipOptions={{ position: "left", showDelay: 500 }}
              />
            </div>
          ) : null}
        </AccordionTab>
      </Accordion>
    </span>
  );
}
