import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  CreateMapInputs,
  MapProps,
  MapItemDisplayDialogProps,
} from "../../../types/MapTypes";
import { useUpdateMap } from "../../../utils/customHooks";
import { MapDialogDefault } from "../../../utils/defaultDisplayValues";

type Props = {
  visible: MapItemDisplayDialogProps;
  setVisible: Dispatch<SetStateAction<MapItemDisplayDialogProps>>;
};

export default function MapUpdateDialog({ visible, setVisible }: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const updateMapMutation = useUpdateMap(project_id as string);

  function recursiveDescendantRemove(
    doc: MapProps,
    index: number,
    array: MapProps[],
    selected_id: string
  ): boolean {
    if (doc.parent === null) {
      return true;
    } else {
      const parent = array.find((d) => d.id === doc.parent?.id);
      if (parent) {
        if (parent.id === selected_id) {
          return false;
        } else {
          return recursiveDescendantRemove(parent, index, array, selected_id);
        }
      } else {
        return false;
      }
    }
  }

  return (
    <Dialog
      className="w-3"
      header={`Update Map - ${visible.title}`}
      modal={false}
      visible={visible.show}
      onHide={() => setVisible(MapDialogDefault)}
    >
      <div>
        <div className="flex flex-wrap justify-content-center">
          <div className="w-8 py-1">
            <InputText
              placeholder="Map Title"
              className="w-full"
              value={visible.title}
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              autoFocus={true}
            />
          </div>
          <div className="w-8 py-1">
            <Dropdown
              className="w-full"
              placeholder="Map Folder"
              optionLabel="title"
              optionValue="id"
              value={visible.parent}
              filter
              onChange={(e) =>
                setVisible((prev) => ({
                  ...prev,
                  parent: e.value,
                }))
              }
              options={
                maps
                  ? [
                      { title: "Root", id: null },
                      ...maps.filter((map, idx, array) => {
                        if (!map.folder || map.id === visible.id) return false;
                        return recursiveDescendantRemove(
                          map,
                          idx,
                          array,
                          visible.id
                        );
                      }),
                    ]
                  : []
              }
            />
          </div>

          <div className="w-full flex justify-content-end">
            <Button
              label={`Update ${visible.folder ? "Folder" : "Map"}`}
              className="p-button-success p-button-outlined mt-2"
              icon="pi pi-save"
              iconPos="right"
              type="submit"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
