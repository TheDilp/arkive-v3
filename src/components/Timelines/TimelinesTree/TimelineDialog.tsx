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
  useUpdateTimelineAge,
  useSortTimelineAges,
  useDeleteTimelineAge,
} from "../../../utils/customHooks";
import { TimelineItemDisplayDialogDefault } from "../../../utils/defaultValues";
import { SelectButton } from "primereact/selectbutton";
import { TabPanel, TabView } from "primereact/tabview";
import { v4 as uuid } from "uuid";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { ColorPicker } from "primereact/colorpicker";
import { TimelineAgeType } from "../../../types/TimelineAgeTypes";
import { confirmDialog } from "primereact/confirmdialog";

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
  const updateTimelineAgeMutation = useUpdateTimelineAge(project_id as string);
  const deleteTimelineAgeMutation = useDeleteTimelineAge(project_id as string);
  const sortTimelineAgesMutation = useSortTimelineAges();
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

  const colorTemplate = (rowData: TimelineAgeType) => {
    return (
      <div className="flex align-items-center justify-content-evenly w-full">
        {rowData.color}{" "}
        <div
          className="w-2rem h-2rem border-round"
          style={{ backgroundColor: rowData.color }}
        ></div>
      </div>
    );
  };
  const deleteTemplate = (rowData: TimelineAgeType) => {
    return (
      <div className="w-3rem">
        <Button
          className="p-button-danger p-button-outlined p-button-rounded"
          icon="pi pi-fw pi-trash"
          iconPos="right"
          onClick={() => {
            confirmDialog({
              message: `Are you sure you want to delete ${rowData.title}?`,
              header: `Deleting ${rowData.title}`,
              icon: "pi pi-exclamation-triangle",
              acceptClassName: "p-button-danger",
              accept: () => {
                deleteTimelineAgeMutation.mutate({
                  id: rowData.id,
                  timeline_id: rowData.timeline_id,
                });
              },
            });
          }}
        />
      </div>
    );
  };

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        className="w-12rem"
        value={options.value}
        onChange={(e) => {
          if (options.editorCallback) options.editorCallback(e.target.value);
        }}
      />
    );
  };
  const colorEditor = (options: ColumnEditorOptions) => {
    return (
      <div className="flex align-items-center justify-content-between w-full">
        <InputText
          className="w-6rem mr-2"
          value={options.value}
          onChange={(e) => {
            if (options.editorCallback) options.editorCallback(e.target.value);
          }}
        />
        <ColorPicker
          className="w-min"
          value={options.value}
          onChange={(e) => {
            if (options.editorCallback && e.value)
              options.editorCallback(
                "#" + e.value.toString().replaceAll("#", "")
              );
          }}
        />
      </div>
    );
  };
  const onRowReorder = (e: any) => {
    const indexes: { id: string; sort: number }[] = e.value.map(
      (age: TimelineAgeType, index: number) => ({
        id: age.id,
        sort: index,
      })
    );
    sortTimelineAgesMutation.mutate({
      project_id: project_id as string,
      timeline_id: eventData.id,
      indexes,
    });
  };
  return (
    <Dialog
      className="w-5"
      style={{
        height: "40rem",
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
                sort: currentTimeline?.timeline_ages.length || 0,
              })
            }
          ></Button>
          <DataTable
            className="overflow-y-auto"
            style={{
              height: "25rem",
            }}
            value={
              currentTimeline?.timeline_ages.sort((a, b) => a.sort - b.sort) ||
              []
            }
            scrollable
            reorderableRows
            onRowReorder={onRowReorder}
            onRowEditComplete={(e) => {
              updateTimelineAgeMutation.mutate({ ...e.newData });
            }}
            editMode="row"
          >
            <Column rowReorder></Column>
            <Column
              field="title"
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              field="color"
              editor={(options) => colorEditor(options)}
              body={colorTemplate}
            ></Column>
            <Column rowEditor className="flex justify-content-center"></Column>
            <Column body={deleteTemplate}></Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </Dialog>
  );
}
