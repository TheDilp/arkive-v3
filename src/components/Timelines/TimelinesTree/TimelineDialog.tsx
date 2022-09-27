import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { TabPanel, TabView } from "primereact/tabview";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { TimelineAgeType } from "../../../types/TimelineAgeTypes";
import {
  TimelineItemDisplayDialogProps,
  TimelineType,
} from "../../../types/TimelineTypes";
import {
  useCreateTimelineAge,
  useDeleteTimelineAge,
  useGetTimelineData,
  useGetTimelines,
  useSortTimelineAges,
  useUpdateTimeline,
  useUpdateTimelineAge,
} from "../../../utils/customHooks";
import { TimelineItemDisplayDialogDefault } from "../../../utils/defaultValues";
import {
  dataTableColorEditor,
  dataTableTextEditor,
} from "../../Util/DataTableEditors";

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

  const onRowReorder = async (e: any) => {
    const indexes: { id: string; sort: number }[] = e.value.map(
      (age: TimelineAgeType, index: number) => ({
        id: age.id,
        sort: index,
      })
    );
    await sortTimelineAgesMutation.mutateAsync({
      project_id: project_id as string,
      timeline_id: eventData.id,
      indexes,
    });
  };
  return (
    <Dialog
      className="w-4"
      style={{
        maxHeight: "40rem",
      }}
      header={`Update Timeline - ${eventData.title}`}
      modal={false}
      visible={eventData.show}
      onHide={() => setEventData(TimelineItemDisplayDialogDefault)}
    >
      <TabView className="">
        <TabPanel header="Timeline Data">
          <div className="w-9 mx-auto px-2 flex flex-wrap justify-content-center">
            <InputText
              className="w-full"
              value={eventData.title}
              onChange={(e) =>
                setEventData((prev) => ({ ...prev, title: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateTimelineMutation.mutate({
                    id: eventData.id,
                    title: eventData.title,
                    parent: eventData.parent === "0" ? null : eventData.parent,
                    defaultOrientation: eventData.defaultOrientation,
                    defaultDetails: eventData.defaultDetails,
                    project_id: project_id as string,
                  });
                }
              }}
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
            className="overflow-y-auto py-4"
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
            <Column
              rowReorder
              style={{
                maxWidth: "1.75rem",
              }}
            ></Column>
            <Column
              field="title"
              header="Title"
              className="w-full"
              editor={(options) => dataTableTextEditor(options)}
            ></Column>
            <Column
              header="Color"
              field="color"
              editor={(options) => dataTableColorEditor(options)}
              body={colorTemplate}
            ></Column>
            <Column
              rowEditor
              className="flex justify-content-center"
              header="Edit"
              headerStyle={{
                maxWidth: "4rem",
              }}
              bodyStyle={{
                maxWidth: "4rem",
              }}
            ></Column>
            <Column
              body={deleteTemplate}
              header="Delete"
              headerStyle={{
                maxWidth: "5rem",
              }}
              bodyStyle={{
                maxWidth: "5rem",
              }}
            ></Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </Dialog>
  );
}
