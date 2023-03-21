import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllImages } from "../../CRUD/ItemsCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { virtualScrollerSettings } from "../../utils/uiUtils";
import { ImageDropdownItem } from "../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../Dropdown/ImageDropdownValue";

export default function InsertImageEditor() {
  const { project_id } = useParams();
  const { data: images } = useGetAllImages(project_id as string);
  const [dialog] = useAtom(DialogAtom);
  const [localImage, setLocalImage] = useState("");

  return (
    <div className="flex w-96 items-center justify-between gap-x-2">
      <Dropdown
        className="flex-1"
        filter
        itemTemplate={ImageDropdownItem}
        onChange={(e) => setLocalImage(e.value)}
        options={images || []}
        placeholder="Select image"
        value={localImage}
        valueTemplate={ImageDropdownValue({ image: localImage })}
        virtualScrollerOptions={virtualScrollerSettings}
      />
      <Button
        className="p-button-rounded p-button-outlined"
        icon="pi pi-image"
        iconPos="right"
        onClick={() => {
          dialog.data?.insertImage({ src: `${baseURLS.baseImageHost}${localImage}` });
        }}
      />
    </div>
  );
}
