import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { DocumentProps } from "../../../../custom-types";
import { MapProps } from "../../../../types/MapTypes";
import {
  useCreateMapMarker,
  useGetDocuments,
  useGetMaps,
} from "../../../../utils/customHooks";
import { MapMarkerDialogDefault } from "../../../../utils/defaultValues";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";
import MarkerIconSelect from "./MarkerIconSelect";

type Props = {
  lat: number;
  lng: number;
  show: boolean;
  setVisible: Dispatch<
    SetStateAction<{ lat: number; lng: number; show: boolean }>
  >;
};

export default function CreateMarkerDialog({
  lat,
  lng,
  show,
  setVisible,
}: Props) {
  const { project_id, map_id } = useParams();
  const createMapMarkerMutation = useCreateMapMarker(project_id as string);
  const [iconSelect, setIconSelect] = useState({
    show: false,
    top: 0,
    left: 0,
  });
  const [newMarkerData, setNewMarkerData] = useState(MapMarkerDialogDefault);
  const documents = useGetDocuments(project_id as string);
  const maps = useGetMaps(project_id as string);
  return (
    <Dialog
      header="New Map Marker"
      visible={show}
      style={{ width: "25vw" }}
      onHide={() => {
        setNewMarkerData(MapMarkerDialogDefault);
        setVisible({ lat: 0, lng: 0, show: false });
      }}
      modal={false}
    >
      <div className="flex flex-wrap">
        <div className="w-full">
          <InputText
            value={newMarkerData.text}
            onChange={(e) =>
              setNewMarkerData((prev) => ({
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

        {/* Icon */}
        <div className="w-full my-2 flex align-items-center justify-content-between">
          <span>Marker Icon:</span>
          <Icon
            className="cursor-pointer"
            fontSize={40}
            icon={newMarkerData.icon}
            color={newMarkerData.color}
            onClick={(e) =>
              setIconSelect({
                ...iconSelect,
                show: true,
                top: e.clientY,
                left: e.clientX,
              })
            }
          />
          <MarkerIconSelect
            {...iconSelect}
            setValue={(icon: string) =>
              setNewMarkerData((prev) => ({
                ...prev,
                icon,
              }))
            }
            setIconSelect={setIconSelect}
          />
          <div className="flex w align-items-center flex-row-reverse">
            <InputText
              value={newMarkerData.color}
              className="w-full ml-2"
              onChange={(e) =>
                setNewMarkerData((prev) => ({
                  ...prev,
                  color: e.target.value,
                }))
              }
            />
            <ColorPicker
              value={newMarkerData.color}
              onChange={(e) =>
                setNewMarkerData((prev) => ({
                  ...prev,
                  color: e.value as string,
                }))
              }
            />
          </div>
        </div>

        {/* Background color */}
        <div className="w-full my-2 flex align-items-center justify-content-between">
          <span>Marker Background:</span>

          <div className="flex align-items-center flex-row-reverse">
            <InputText
              value={newMarkerData.backgroundColor}
              className="w-full ml-2"
              onChange={(e) =>
                setNewMarkerData((prev) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }))
              }
            />
            <ColorPicker
              value={newMarkerData.backgroundColor}
              onChange={(e) =>
                setNewMarkerData((prev) => ({
                  ...prev,
                  backgroundColor: e.value as string,
                }))
              }
            />
          </div>
        </div>

        {/* Public setting */}
        <div className="w-full my-3">
          <div className="w-full">
            <label className="mr-2">Public:</label>
            <Checkbox
              checked={newMarkerData.public}
              onChange={(e) =>
                setNewMarkerData((prev) => ({ ...prev, public: e.checked }))
              }
            />
          </div>
          <span className="text-xs text-gray-400">
            If a document is linked, the marker will use its public setting by
            default.
          </span>
        </div>

        {/* Document Selection */}
        <div className="w-full">
          <Dropdown
            className="w-full"
            placeholder="Link Document"
            filter
            filterBy="title"
            value={newMarkerData.doc_id}
            onChange={(e) => {
              let doc = documents.data?.find(
                (doc: DocumentProps) => doc.id === e.value
              );
              setNewMarkerData((prev) => ({
                ...prev,
                doc_id: e.value,
                public: doc ? doc.public : prev.public,
              }));
            }}
            options={documents.data?.filter(
              (doc) => !doc.template && !doc.folder
            )}
            optionLabel={"title"}
            optionValue={"id"}
          />
        </div>

        {/* Linked Map Selection */}
        <div className="w-full">
          <Dropdown
            className="w-full mt-2"
            placeholder="Link Map"
            filter
            filterBy="title"
            itemTemplate={(item: MapProps) => (
              <ImgDropdownItem
                title={item.title}
                link={item.map_image?.link || ""}
              />
            )}
            value={newMarkerData.map_link}
            onChange={(e) =>
              setNewMarkerData((prev) => ({
                ...prev,
                map_link: e.value,
              }))
            }
            options={maps.data?.filter(
              (map) => !map.folder && map.id !== map_id
            )}
            optionLabel={"title"}
            optionValue={"id"}
          />
        </div>
        <div className="w-full flex justify-content-end mt-2">
          <Button
            className="p-button-outlined"
            label="Create Marker"
            icon="pi pi-map-marker"
            iconPos="right"
            onClick={() => {
              const { show, ...rest } = newMarkerData;
              createMapMarkerMutation.mutate({
                ...rest,
                id: uuid(),
                backgroundColor:
                  "#" + newMarkerData.backgroundColor.replace("#", ""),
                lat,
                lng,
                map_id: map_id as string,
              });
              setNewMarkerData(MapMarkerDialogDefault);
              setVisible({ lat: 0, lng: 0, show: false });
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
