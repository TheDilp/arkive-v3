import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { TimelineItemDisplayDialogProps, TimelineType } from "../../../types/TimelineTypes";
import { useGetTimelines, useUpdateTimeline } from "../../../utils/customHooks";
import { TimelineItemDisplayDialogDefault } from "../../../utils/defaultValues";

type Props = {
    eventData: TimelineItemDisplayDialogProps;
    setEventData: Dispatch<SetStateAction<TimelineItemDisplayDialogProps>>;
};

export default function TimelineDialog({ eventData, setEventData }: Props) {
    const { project_id } = useParams();
    const { data: timelines } = useGetTimelines(project_id as string);
    const updateTimelineMutation = useUpdateTimeline()
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


    return (
        <Dialog
            className="w-3"
            header={`Update Map - ${eventData.title}`}
            modal={false}
            visible={eventData.show}
            onHide={() => setEventData(TimelineItemDisplayDialogDefault)}
        >
            <div className="w-full px-6 flex flex-wrap justify-content-center">
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
                                        if (!timeline.folder || timeline.id === eventData.id) return false;
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

                <div className="w-full flex justify-content-end mt-2">
                    <Button label="Update Timeline" icon="pi pi-save" className="p-button-outlined" onClick={() => {
                        updateTimelineMutation.mutate({ id: eventData.id, title: eventData.title, parent: eventData.parent, project_id: project_id as string })
                    }} />
                </div>
            </div>
        </Dialog>
    );
}