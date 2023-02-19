import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCreateSwatch } from "../../../CRUD/ProjectCRUD";
import { useHandleChange } from "../../../hooks/useGetChanged";
import { SwatchType } from "../../../types/ItemTypes/projectTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { buttonLabelWithIcon } from "../../../utils/transform";
import ColorInput from "../../ColorInput/ColorInput";
import DrawerSection from "../DrawerSection";

export default function DrawerSwatchContent() {
  const { project_id } = useParams();
  const [drawer] = useAtom(DrawerAtom);
  const [localItem, setLocalItem] = useState<SwatchType>(
    (drawer?.data as SwatchType) ?? { id: "", title: "", color: "#595959" },
  );
  const { handleChange, changedData, resetChanges } = useHandleChange({ data: localItem, setData: setLocalItem });
  const { mutateAsync, isLoading: isMutating } = useCreateSwatch(project_id as string);
  return (
    <div className="flex flex-col">
      {`${localItem?.id ? "Update" : "Create"} Swatch`}

      <DrawerSection title="Swatch name (optional)">
        <InputText name="title" onChange={(e) => handleChange(e.target)} value={localItem?.title} />
      </DrawerSection>
      <DrawerSection title="Swatch color">
        <ColorInput color={localItem.color} name="color" onChange={handleChange} />
      </DrawerSection>

      <Button
        className="p-button-outlined p-button-success ml-auto"
        disabled={!localItem.color}
        loading={isMutating}
        onClick={async () => {
          await mutateAsync({ id: crypto.randomUUID(), ...changedData });
          resetChanges();
        }}
        type="submit">
        {buttonLabelWithIcon("Save", "mdi:content-save")}
      </Button>
    </div>
  );
}
