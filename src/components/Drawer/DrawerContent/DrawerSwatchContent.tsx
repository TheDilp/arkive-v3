import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSwatch, useUpdateSwatch } from "../../../CRUD/ProjectCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { SwatchType } from "../../../types/ItemTypes/projectTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { buttonLabelWithIcon } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import DrawerSection from "../DrawerSection";

const DefaultSwatch = { id: "", title: "", color: "#595959" };

export default function DrawerSwatchContent() {
  const { project_id } = useParams();
  const [drawer] = useAtom(DrawerAtom);
  const [localItem, setLocalItem] = useState<SwatchType>((drawer?.data as SwatchType) ?? DefaultSwatch);

  useEffect(() => {
    if (drawer?.data) setLocalItem(drawer?.data as SwatchType);
    else setLocalItem(DefaultSwatch);
  }, [drawer?.data]);

  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const { mutateAsync: createSwatch, isLoading: isMutating } = useCreateSwatch(project_id as string);
  const { mutateAsync: updateSwatch, isLoading: isUpdating } = useUpdateSwatch(project_id as string);
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-center text-2xl">
        {document ? (
          `${localItem?.id ? "Update" : "Create"} Swatch`
        ) : (
          <div className="flex items-center">Create New Document</div>
        )}
      </h2>

      <DrawerSection title="Swatch name (optional)">
        <InputText
          name="title"
          onChange={(e) => handleChange(e.target)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && localItem?.color) {
              if (!localItem?.id) {
                await createSwatch({ id: crypto.randomUUID(), project_id, ...changedData });
                setLocalItem(DefaultSwatch);
              } else {
                await updateSwatch({ id: localItem.id, title: localItem.title });
              }
              resetChanges();
            }
          }}
          value={localItem?.title}
        />
      </DrawerSection>
      {localItem?.id ? null : (
        <DrawerSection title="Swatch color">
          <ColorInput
            color={localItem.color}
            isDisabled={!!localItem.id}
            name="color"
            onChange={handleChange}
            onEnter={async () => {
              if (localItem?.color) {
                if (!localItem?.id) {
                  await createSwatch({ id: crypto.randomUUID(), project_id, ...changedData });
                  setLocalItem(DefaultSwatch);
                } else {
                  await updateSwatch({ id: localItem.id, title: localItem.title });
                }
                resetChanges();
              }
            }}
          />
        </DrawerSection>
      )}

      <Button
        className="p-button-outlined p-button-success ml-auto"
        disabled={!localItem.color}
        loading={isMutating || isUpdating}
        onClick={async () => {
          if (!localItem?.id) {
            await createSwatch({ id: crypto.randomUUID(), project_id, ...changedData });
            setLocalItem(DefaultSwatch);
          } else {
            await updateSwatch({ id: localItem.id, title: localItem.title });
          }
          resetChanges();
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
