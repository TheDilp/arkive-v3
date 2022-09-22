import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import {
  TimelineItemDisplayDialogProps,
  TimelineType,
} from "../../../types/TimelineTypes";
import {
  useCreateTimelineAge,
  useGetTimelines,
  useGetTimelineData,
  useUpdateTimeline,
} from "../../../utils/customHooks";
import { TimelineItemDisplayDialogDefault } from "../../../utils/defaultValues";
import { SelectButton } from "primereact/selectbutton";
import { TabPanel, TabView } from "primereact/tabview";
import { v4 as uuid } from "uuid";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColorPicker } from "primereact/colorpicker";

type Props = {
  eventData: TimelineItemDisplayDialogProps;
  setEventData: Dispatch<SetStateAction<TimelineItemDisplayDialogProps>>;
};

export default function TimelineDialog({ eventData, setEventData }: Props) {
  const { project_id } = useParams();
  const { data: timelines } = useGetTimelines(project_id as string);
  const currentTimeline = useGetTimelineData(
    project_id as string,
    eventData.id
  );
  const updateTimelineMutation = useUpdateTimeline();
  const createTimelineAgeMutation = useCreateTimelineAge(project_id as string);
  function recursiveDescendantRemove(
    timeline: TimelineType,
    index: number,
    array: TimelineType[],
    selected_id: string
  ): boolean {
    if (timeline.parent === null) {
      return true;
    } else {
      const parent = array.find((d) => d.id === timeline.parent?.id);
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
  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const colorEditor = (options: any) => {
    return (
      <ColorPicker
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  return (
    <Dialog
      className="w-3"
      style={{
        height: "30rem",
      }}
      header={`Update Timeline - ${eventData.title}`}
      modal={false}
      visible={eventData.show}
      onHide={() => setEventData(TimelineItemDisplayDialogDefault)}
    >
      <TabView>
        <TabPanel header="Timeline Data">
          <div className="w-full px-2 flex flex-wrap justify-content-center">
            <InputText
              className="w-full"
              value={eventData.title}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Timeline Title"
            />

            <div className="w-full my-1">
              <Dropdown
                className="w-full"
                placeholder="Map Folder"
                optionLabel="title"
                optionValue="id"
                value={eventData.parent}
                filter
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    parent: e.value,
                  }))
                }
                options={
                  timelines
                    ? [
                        { title: "Root", id: null },
                        ...timelines.filter((timeline, idx, array) => {
                          if (!timeline.folder || timeline.id === eventData.id)
                            return false;
                          return recursiveDescendantRemove(
                            timeline,
                            idx,
                            array,
                            eventData.id
                          );
                        }),
                      ]
                    : []
                }
              />
            </div>

            <div className="w-full my-2 flex justify-content-between">
              <div>
                <div className="pb-1 text-center text-gray-200">
                  Default Orientation
                </div>
                <SelectButton
                  value={eventData.defaultOrientation}
                  options={[
                    { label: "Horizontal", value: "horizontal" },
                    { label: "Vertical", value: "vertical" },
                  ]}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      defaultOrientation: e.value,
                    }))
                  }
                />
              </div>
              <div>
                <div className="pb-1 text-center text-gray-200">
                  Default Details
                </div>
                <SelectButton
                  value={eventData.defaultDetails}
                  options={[
                    { label: "Detailed", value: "detailed" },
                    { label: "Simple", value: "simple" },
                  ]}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      defaultDetails: e.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="w-full flex"></div>

            <div className="w-full flex justify-content-end mt-2">
              <Button
                label="Update Timeline"
                icon="pi pi-save"
                className="p-button-outlined"
                onClick={() => {
                  updateTimelineMutation.mutate({
                    id: eventData.id,
                    title: eventData.title,
                    parent: eventData.parent === "0" ? null : eventData.parent,
                    defaultOrientation: eventData.defaultOrientation,
                    defaultDetails: eventData.defaultDetails,
                    project_id: project_id as string,
                  });
                }}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Ages">
          <Button
            className="p-button-outlined"
            label="Create Age"
            icon="pi pi-plus"
            iconPos="right"
            onClick={() =>
              createTimelineAgeMutation.mutate({
                id: uuid(),
                title: "New Age",
                timeline_id: eventData.id,
                color: "#121212",
                sort: 0,
              })
            }
          ></Button>
          <DataTable
            value={currentTimeline?.timeline_ages || []}
            reorderableRows
          >
            <Column rowReorder></Column>
            <Column
              field="title"
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              field="color"
              editor={(options) => colorEditor(options)}
            ></Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </Dialog>
  );
}
