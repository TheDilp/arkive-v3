import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  MapItemDisplayDialogProps,
  MapProps,
} from "../../../../types/MapTypes";
import { useUpdateMap } from "../../../../utils/customHooks";
import { MapDialogDefault } from "../../../../utils/defaultValues";

type Props = {
  mapData: MapItemDisplayDialogProps;
  setMapData: Dispatch<SetStateAction<MapItemDisplayDialogProps>>;
};

export default function MapUpdateDialog({ mapData, setMapData }: Props) {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const updateMapMutation = useUpdateMap(project_id as string);

  function recursiveDescendantRemove(
    map: MapProps,
    index: number,
    array: MapProps[],
    selected_id: string
  ): boolean {
    if (map.parent === null) {
      return true;
    } else {
      const parent = array.find((d) => d.id === map.parent?.id);
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
      header={`Update Map - ${mapData.title}`}
      modal={false}
      visible={mapData.show}
      onHide={() => setMapData(MapDialogDefault)}
    >
      <div>
        <div className="flex flex-wrap justify-content-center">
          <div className="w-8 py-1">
            <InputText
              placeholder="Map Title"
              className="w-full"
              value={mapData.title}
              onChange={(e) =>
                setMapData((prev) => ({
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
              value={mapData.parent}
              filter
              onChange={(e) =>
                setMapData((prev) => ({
                  ...prev,
                  parent: e.value,
                }))
              }
              options={
                maps
                  ? [
                      { title: "Root", id: null },
                      ...maps.filter((map, idx, array) => {
                        if (!map.folder || map.id === mapData.id) return false;
                        return recursiveDescendantRemove(
                          map,
                          idx,
                          array,
                          mapData.id
                        );
                      }),
                    ]
                  : []
              }
            />
          </div>

          <div className="w-full flex justify-content-end">
            <Button
              label={`Update ${mapData.folder ? "Folder" : "Map"}`}
              className="p-button-success p-button-outlined mt-2"
              icon="pi pi-save"
              iconPos="right"
              onClick={() =>
                updateMapMutation.mutate({
                  id: mapData.id,
                  title: mapData.title,
                  parent: mapData.parent === "0" ? null : mapData.parent,
                })
              }
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
