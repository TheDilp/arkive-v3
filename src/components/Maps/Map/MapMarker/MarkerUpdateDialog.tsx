import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentProps } from "../../../../custom-types";
import { MapProps, UpdateMarkerInputs } from "../../../../types/MapTypes";
import {
  useGetDocuments,
  useGetMaps,
  useUpdateMapMarker,
} from "../../../../utils/customHooks";
import { MapMarkerDialogDefault } from "../../../../utils/defaultValues";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";
import MarkerIconSelect from "./MarkerIconSelect";
type Props = {
  id: string;
  show: boolean;
  text: string;
  color: string;
  backgroundColor: string;
  icon: string;
  doc_id?: string;
  map_link?: string;
  public: boolean;
  setVisible: Dispatch<SetStateAction<UpdateMarkerInputs>>;
};

export default function MarkerUpdateDialog({
  id,
  text,
  color,
  backgroundColor,
  icon,
  doc_id,
  map_link,
  public: markerPublic,
  show,
  setVisible,
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
      onHide={() => setVisible(MapMarkerDialogDefault)}
    >
      <div className="flex flex-wrap">
        <div className="w-full">
          <InputText
            value={text}
            onChange={(e) => {
              setVisible((prev) => {
                return {
                  ...prev,
                  text: e.target.value,
                };
              });
            }}
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
          <MarkerIconSelect
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
        <div className="w-full my-2 flex align-items-center justify-content-evenly flex-wrap">
          <span>Marker Background:</span>

          <div className="flex align-items-center flex-row-reverse">
            <InputText
              value={backgroundColor}
              className="w-full ml-2"
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }))
              }
            />
            <ColorPicker
              value={backgroundColor}
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  backgroundColor: "#" + e.value?.toString().replace("#", ""),
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
              checked={markerPublic}
              onChange={(e) =>
                setVisible((prev) => ({ ...prev, public: e.checked }))
              }
            />
          </div>
          <span className="text-xs text-gray-400">
            If a document is linked, the marker will use its public setting by
            default.
          </span>
        </div>

        <div className="w-full">
          <Dropdown
            className="w-full"
            placeholder="Link Document"
            value={doc_id}
            filter
            filterBy="title"
            onChange={(e) => {
              let doc = documents.data?.find(
                (doc: DocumentProps) => doc.id === e.value
              );
              setVisible((prev) => ({
                ...prev,
                doc_id: e.value,
                public: doc ? doc.public : prev.public,
              }));
            }}
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
            itemTemplate={(item: MapProps) => (
              <ImgDropdownItem
                title={item.title}
                link={item.map_image?.link || ""}
              />
            )}
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
              updateMarkerMutation.mutate({
                id,
                text,
                icon,
                color,
                backgroundColor,
                doc_id,
                map_link,
                public: markerPublic,
                map_id: map_id as string,
                project_id: project_id as string,
              });
              setVisible(MapMarkerDialogDefault);
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
