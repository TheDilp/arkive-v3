import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ImageProps } from "../../../../custom-types";
import { MapProps } from "../../../../types/MapTypes";
import { useCreateMap, useGetImages } from "../../../../utils/customHooks";
import { MapCreateDefault } from "../../../../utils/defaultValues";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";

type Props = {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

export default function MapCreateDialog({ openDialog, setOpenDialog }: Props) {
  const [closeOnDone, setCloseOnDone] = useState(true);
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const images = useGetImages(project_id as string);
  const [newMapData, setNewMapData] = useState(MapCreateDefault);
  const createMapMutation = useCreateMap();

  return (
    <Dialog
      className="w-3"
      header={"Create Map"}
      visible={openDialog}
      onHide={() => setOpenDialog(false)}
      modal={false}
    >
      <div className="flex flex-wrap justify-content-center">
        <div className="w-8">
          <InputText
            placeholder="Map Title"
            className="w-full"
            value={newMapData.title}
            onChange={(e) =>
              setNewMapData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
        <div className="w-8 py-2">
          <Dropdown
            value={newMapData.map_image}
            itemTemplate={(item: ImageProps) => (
              <ImgDropdownItem title={item.title} link={item.link} />
            )}
            options={images?.data.filter((image) => image.type === "Map") || []}
            virtualScrollerOptions={{
              lazy: true,
              onLazyLoad: () => {},
              itemSize: 50,
              showLoader: true,
              loading: images?.data.length === 0,
              delay: 0,
              loadingTemplate: (options) => {
                return (
                  <div
                    className="flex align-items-center p-2"
                    style={{ height: "38px" }}
                  ></div>
                );
              },
            }}
            onChange={(e) =>
              setNewMapData((prev) => ({ ...prev, map_image: e.value }))
            }
            placeholder="Map Image"
            optionLabel="title"
            className="w-full"
          />
        </div>
        <div className="w-8">
          <Dropdown
            className="w-full"
            placeholder="Map Parent"
            optionLabel="title"
            optionValue="id"
            value={newMapData.parent}
            onChange={(e) =>
              setNewMapData((prev) => ({ ...prev, parent: e.target.value }))
            }
            options={maps?.filter((map) => map.folder) || []}
          />
        </div>
        <div className="w-8 flex justify-content-between my-2">
          <div className="w-1/2 flex align-items-center">
            <span className="pr-1">Is Folder:</span>
            <Checkbox
              checked={newMapData.folder}
              onChange={(e) =>
                setNewMapData((prev) => ({ ...prev, folder: e.checked }))
              }
            />
          </div>
        </div>
        <div className="w-8 flex mb-2 justify-content-between  align-items-center">
          <span>Close Dialog on Done:</span>
          <Checkbox
            checked={closeOnDone}
            onChange={(e) => setCloseOnDone(e.checked)}
          />
        </div>
        <div className="w-full flex justify-content-end">
          <Button
            label="Create Map"
            className="p-button-success p-button-outlined p-button-raised"
            icon="pi pi-plus"
            iconPos="right"
            onClick={() => {
              if (newMapData.map_image) {
                createMapMutation.mutate({
                  ...newMapData,
                  id: uuid(),
                  project_id: project_id as string,
                });
                setNewMapData(MapCreateDefault);
                if (closeOnDone) setOpenDialog(false);
              }
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
