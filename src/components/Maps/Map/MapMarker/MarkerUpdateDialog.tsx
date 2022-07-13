import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  UpdateMapMarkerProps,
  UpdateMarkerInputs,
} from "../../../../custom-types";
import {
  useGetDocuments,
  useGetMaps,
  useUpdateMapMarker,
} from "../../../../utils/customHooks";
import CreateMarkerIconSelect from "./MarkerIconSelect";
type Props = {
  id: string;
  show: boolean;
  text: string;
  color: string;
  backgroundColor: string;
  icon: string;
  doc_id?: string;
  map_link?: string;
  setVisible: Dispatch<SetStateAction<UpdateMarkerInputs>>;
};

export default function MarkerUpdateDialog({
  id,
  show,
  setVisible,
  text,
  color,
  icon,
  doc_id,
  map_link,
}: Props) {
  const { project_id, map_id } = useParams();
  const [iconSelect, setIconSelect] = useState({
    show: false,
    top: 0,
    left: 0,
  });
  const updateMarkerMutation = useUpdateMapMarker();

  const documents = useGetDocuments(project_id as string);
  const maps = useGetMaps(project_id as string);
  return (
    <Dialog
      header={`Update Marker - ${text}`}
      visible={show}
      modal={false}
      style={{ width: "25vw" }}
      onHide={() =>
        setVisible({
          id: "",
          text: "",
          icon: "",
          color: "",
          backgroundColor: "",
          doc_id: "",
          show: false,
          map_link: "",
        })
      }
    >
      <div className="flex flex-wrap">
        <div className="w-full">
          <InputText
            value={text}
            onChange={(e) =>
              setVisible((prev) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            autoComplete={"false"}
            className="w-full"
            placeholder="Marker popup text"
            autoFocus={true}
          />
        </div>
        <div className="w-full my-2 flex align-items-center justify-content-evenly flex-wrap">
          <span>Marker Icon:</span>
          <Icon
            className="cursor-pointer"
            fontSize={40}
            icon={icon}
            color={color}
            onClick={(e) =>
              setIconSelect({
                ...iconSelect,
                show: true,
                top: e.clientY,
                left: e.clientX,
              })
            }
          />
          <CreateMarkerIconSelect
            {...iconSelect}
            setValue={(icon: string) =>
              setVisible((prev) => ({
                ...prev,
                icon,
              }))
            }
            setIconSelect={setIconSelect}
          />
          <div className="flex align-items-center flex-row-reverse">
            <InputText
              value={color}
              className="w-full ml-2"
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  color: e.target.value,
                }))
              }
            />
            <ColorPicker
              value={color}
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  color: e.value as string,
                }))
              }
            />
          </div>
        </div>
        <div className="w-full">
          <Dropdown
            className="w-full"
            placeholder="Link Document"
            value={doc_id}
            onChange={(e) =>
              setVisible((prev) => ({
                ...prev,
                doc_id: e.target.value,
              }))
            }
            options={
              documents.data
                ? [
                    { title: "No document", id: null },
                    ...documents.data.filter(
                      (doc) => !doc.template && !doc.folder
                    ),
                  ]
                : []
            }
            optionLabel={"title"}
            optionValue={"id"}
          />
        </div>
        <div className="w-full">
          <Dropdown
            className="w-full mt-2"
            placeholder="Map Link"
            value={map_link}
            onChange={(e) =>
              setVisible((prev) => ({
                ...prev,
                map_link: e.target.value,
              }))
            }
            options={
              maps.data
                ? [
                    { title: "No map", id: null },
                    ...maps.data.filter((map) => !map.folder),
                  ]
                : []
            }
            optionLabel={"title"}
            optionValue={"id"}
          />
        </div>
        <div className="w-full flex justify-content-end mt-2">
          <Button
            className="p-button-outlined p-button-success"
            label="Update Marker"
            icon="pi pi-save"
            iconPos="right"
            onClick={() => {
              setVisible({
                id: "",
                text: "",
                icon: "",
                color: "",
                backgroundColor: "",
                doc_id: "",
                show: false,
                map_link: "",
              });
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
