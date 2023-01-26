import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllImages } from "../../CRUD/ItemsCRUD";
import { baseURLS } from "../../types/CRUDenums";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { ImageDropdownItem } from "../Dropdown/ImageDropdownItem";
import ImageDropdownValue from "../Dropdown/ImageDropdownValue";

export default function InsertImageEditor() {
  const { project_id } = useParams();
  const { data: images } = useGetAllImages(project_id as string);
  const [dialog] = useAtom(DialogAtom);
  const [localImage, setLocalImage] = useState("");

  return (
    <div>
      <Dropdown
        itemTemplate={ImageDropdownItem}
        onChange={(e) => setLocalImage(e.value)}
        options={images || []}
        placeholder="Select map"
        value={localImage}
        valueTemplate={ImageDropdownValue({ image: localImage })}
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
