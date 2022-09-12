import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { Tooltip } from "primereact/tooltip";
import { useParams } from "react-router-dom";
import { DocumentProps, ImageProps } from "../../../../custom-types";
import { TimelineEventUpdateType } from "../../../../types/TimelineEventTypes";
import { ColorPresets } from "../../../../utils/boardUtils";
import {
    useCreateTimelineEvent,
    useDeleteTimelineEvent,
    useGetDocuments,
    useGetImages,
    useGetMaps,
    useUpdateTimelineEvent,
} from "../../../../utils/customHooks";
import { toastWarn } from "../../../../utils/utils";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";
import { MapProps } from "../../../../types/MapTypes";
import { v4 as uuid } from "uuid";
import { TimelineEventCreateDefault } from "../../../../utils/defaultValues";
import { InputTextarea } from "primereact/inputtextarea";
import { confirmDialog } from "primereact/confirmdialog";

export default function TimelineEventDialog() {
    const { showDialog, setShowDialog, eventData, setEventData } =
        useContext(TimelineEventContext);
    const { project_id, timeline_id } = useParams();
    const { data: docs } = useGetDocuments(project_id as string);
    const images = useGetImages(project_id as string);
    const createTimelineEventMutation = useCreateTimelineEvent(
        project_id as string
    );
    const updateTimelineEventMutation = useUpdateTimelineEvent(
        project_id as string
    );
    const deleteTimelineEventMutation = useDeleteTimelineEvent();
    const { data: maps } = useGetMaps(project_id as string);
    const [closeOnDone, setCloseOnDone] = useState(true);


    const confirmdelete = () => {
        confirmDialog({
            message: (
                <div>
                    {`Are you sure you want to delete ${eventData?.title || "this event"}?`}
                </div>
            ),
            header: `Delete ${eventData?.title || "Event"}`,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-outlined text-red-500",
            accept: async () => {
                if (eventData?.id)
                    deleteTimelineEventMutation.mutate({
                        id: eventData.id,
                        project_id: project_id as string,
                        timeline_id: timeline_id as string
                    });
                setShowDialog(false);
            },
            reject: () => { },
        });
    };


    return (
        <Dialog
            header={`${eventData?.id === "" ? "Create" : "Update"} Timeline Event`}
            visible={showDialog}
            onHide={() => { setShowDialog(false); setEventData(TimelineEventCreateDefault) }}
            className="w-3"
            modal={false}
        >
            {eventData && (
                <div className="flex flex-wrap justify-content-center">
                    <div className="w-full">
                        <InputText
                            placeholder="Timeline Event Title"
                            className="w-full"
                            value={eventData.title}
                            onChange={(e) => {
                                setEventData(
                                    (prev) =>
                                    ({
                                        ...prev,
                                        title: e.target.value,
                                    } as TimelineEventUpdateType)
                                );
                            }}
                            autoFocus={true}
                        />
                    </div>
                    <div className="w-full my-2">
                        <Dropdown
                            value={eventData.image}
                            filter
                            itemTemplate={(item: ImageProps) => (
                                <ImgDropdownItem title={item.title} link={item.link} />
                            )}
                            options={
                                images?.data.filter((image) => image.type === "Image") || []
                            }
                            onChange={(e) =>
                                setEventData(
                                    (prev) =>
                                        ({ ...prev, image: e.value } as TimelineEventUpdateType)
                                )
                            }
                            virtualScrollerOptions={{
                                lazy: true,
                                onLazyLoad: () => { },
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
                            placeholder="Timeline Event Image"
                            optionLabel="title"
                            className="w-full"
                        />
                    </div>
                    <div className="w-full">
                        <Dropdown
                            className="w-full"
                            placeholder="Link Document"
                            value={eventData.doc_id}
                            filter
                            filterBy="title"
                            onChange={(e) => {
                                let doc = docs?.find(
                                    (doc: DocumentProps) => doc.id === e.value
                                );
                                if (doc) {
                                    setEventData(
                                        (prev) =>
                                            ({ ...prev, doc_id: doc?.id } as TimelineEventUpdateType)
                                    );
                                }
                            }}
                            options={
                                docs
                                    ? [
                                        { title: "No document", id: null },
                                        ...docs.filter((doc) => !doc.template && !doc.folder),
                                    ]
                                    : []
                            }
                            optionLabel={"title"}
                            optionValue={"id"}
                        />
                    </div>

                    <div className="w-full">
                        <Dropdown
                            className="w-full"
                            placeholder="Link Map"
                            filter
                            filterBy="title"
                            virtualScrollerOptions={{
                                lazy: true,
                                onLazyLoad: () => { },
                                itemSize: 50,
                                showLoader: true,
                                loading: maps?.length === 0,
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
                            itemTemplate={(item: MapProps) => (
                                <ImgDropdownItem
                                    title={item.title}
                                    link={item.map_image?.link || ""}
                                />
                            )}
                            value={eventData.map_id}
                            onChange={(e) =>
                                setEventData(
                                    (prev) =>
                                    ({
                                        ...prev,
                                        map_id: e.value,
                                    } as TimelineEventUpdateType)
                                )
                            }
                            options={maps?.filter(
                                (map) => !map.folder
                            )}
                            optionLabel={"title"}
                            optionValue={"id"}
                        />
                    </div>

                    {/* Start date fields */}
                    <div className="w-full flex flex-wrap justify-content-between py-2">
                        <label className="w-full text-gray-300 mb-2">Start Date</label>
                        <div className="w-3">
                            <InputNumber
                                placeholder="Start Day"
                                inputClassName="w-full"
                                incrementButtonClassName="w-12"
                                decrementButtonClassName="w-12"
                                showButtons
                                min={0}
                                max={2147483600}
                                value={eventData.start_day}
                                onChange={(e) =>
                                    setEventData(
                                        (prev) =>
                                        ({
                                            ...prev,
                                            start_day: e.value || undefined,
                                        } as TimelineEventUpdateType)
                                    )
                                }
                            />
                        </div>
                        <div className="w-4">
                            <InputNumber
                                placeholder="Start Month"
                                inputClassName="w-full"
                                incrementButtonClassName="w-12"
                                decrementButtonClassName="w-12"
                                showButtons
                                min={0}
                                max={2147483600}
                                value={eventData.start_month}
                                onChange={(e) =>
                                    setEventData(
                                        (prev) =>
                                        ({
                                            ...prev,
                                            start_month: e.value || undefined,
                                        } as TimelineEventUpdateType)
                                    )
                                }
                            />
                        </div>
                        <div className="w-4">
                            <InputNumber
                                placeholder="Start Year"
                                inputClassName="w-full"
                                incrementButtonClassName="w-12"
                                decrementButtonClassName="w-12"
                                showButtons
                                min={0}
                                max={2147483600}
                                value={eventData.start_year}
                                onChange={(e) =>
                                    setEventData(
                                        (prev) =>
                                        ({
                                            ...prev,
                                            start_year: e.value || 0,
                                        } as TimelineEventUpdateType)
                                    )
                                }
                            />
                        </div>
                    </div>
                    {/* End date fields */}
                    <div className="w-full flex flex-wrap justify-content-between">
                        <label className="w-full text-gray-300 mb-2">End Date</label>
                        <div className="w-3">
                            <InputNumber
                                placeholder="End Day"
                                inputClassName="w-full"
                                incrementButtonClassName="w-12"
                                decrementButtonClassName="w-12"
                                showButtons
                                min={0}
                                max={2147483600}
                                value={eventData.end_day}
                                onChange={(e) =>
                                    setEventData(
                                        (prev) =>
                                        ({
                                            ...prev,
                                            end_day: e.value || undefined,
                                        } as TimelineEventUpdateType)
                                    )
                                }
                            />
                        </div>
                        <div className="w-4">
                            <InputNumber
                                placeholder="End Month"
                                inputClassName="w-full"
                                incrementButtonClassName="w-12"
                                decrementButtonClassName="w-12"
                                showButtons
                                min={0}
                                max={2147483600}
                                value={eventData.end_month}
                                onChange={(e) =>
                                    setEventData(
                                        (prev) =>
                                        ({
                                            ...prev,
                                            end_month: e.value || undefined,
                                        } as TimelineEventUpdateType)
                                    )
                                }
                            />
                        </div>
                        <div className="w-4">
                            <InputNumber
                                placeholder="End Year"
                                inputClassName="w-full"
                                incrementButtonClassName="w-12"
                                decrementButtonClassName="w-12"
                                showButtons
                                min={0}
                                max={2147483600}
                                value={eventData.end_year}
                                onChange={(e) =>
                                    setEventData(
                                        (prev) =>
                                        ({
                                            ...prev,
                                            end_year: e.value || 0,
                                        } as TimelineEventUpdateType)
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="w-full flex my-2 justify-content-between align-items-center">
                        <span>Event Card Color:</span>
                        <InputText
                            value={eventData.eventBgColor}
                            onChange={(e) =>
                                setEventData(
                                    (prev) =>
                                    ({
                                        ...prev,
                                        eventBgColor:
                                            "#" + e.target.value?.toString().replaceAll("#", ""),
                                    } as TimelineEventUpdateType)
                                )
                            }
                            prefix="#"
                        />
                        <i className="pi pi-fw pi-palette cursor-pointer hover:text-blue-300 colorPresets"></i>
                        <Tooltip
                            target={".colorPresets"}
                            position="top"
                            autoHide={false}
                            hideEvent="focus"
                        >
                            <div className="flex flex-wrap w-10rem">
                                {ColorPresets.map((color) => (
                                    <div
                                        key={color}
                                        className="w-1rem h-1rem border-rounded cursor-pointer"
                                        style={{
                                            backgroundColor: `#${color}`,
                                        }}
                                        onClick={() => {
                                            setEventData(
                                                (prev) =>
                                                ({
                                                    ...prev,
                                                    eventBgColor:
                                                        "#" + color.toString().replaceAll("#", ""),
                                                } as TimelineEventUpdateType)
                                            );
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </Tooltip>
                        <ColorPicker
                            value={eventData.eventBgColor}
                            onChange={(e) =>
                                setEventData(
                                    (prev) =>
                                    ({
                                        ...prev,
                                        eventBgColor:
                                            "#" + e.value?.toString().replaceAll("#", ""),
                                    } as TimelineEventUpdateType)
                                )
                            }
                        />
                    </div>
                    <div className="w-full flex mb-2 justify-content-between align-items-center">
                        <span>Event Card Style:</span>
                        <Dropdown value={eventData.styleType} onChange={(e) => setEventData(prev => ({ ...prev, styleType: e.value }) as TimelineEventUpdateType)} options={[{ value: "background", display: "Background" }, { value: "outline", display: "Outline" }]} optionLabel="display" optionValue="value" />
                    </div>
                    <div className="w-full flex mb-2 justify-content-between align-items-center">
                        <InputTextarea className="w-full" rows={3} value={eventData.description} onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }) as TimelineEventUpdateType)} />
                    </div>
                    <div className="w-full flex mb-2 justify-content-between align-items-center">
                        <span>Close Dialog on Done:</span>
                        <Checkbox
                            checked={closeOnDone}
                            onChange={(e) => setCloseOnDone(e.checked)}
                        />
                    </div>
                    <div className="w-full flex justify-content-between">
                        {eventData.id !== "" && <Button label="Delete" className="p-button-danger p-button-outlined" icon="pi pi-trash" onClick={confirmdelete} />}
                        <Button
                            label={`${eventData.id === "" ? "Create" : "Update"} Timeline Event`}
                            className="p-button-primary p-button-outlined p-button-raised"
                            icon="pi pi-save"
                            iconPos="right"
                            type="submit"
                            onClick={() => {
                                if (eventData.end_year && eventData.start_year) {
                                    if (eventData.end_year < eventData.start_year) {
                                        toastWarn("End date cannot be less than start date.");
                                        return;
                                    } else if (eventData.end_year === eventData.start_year) {
                                        if (eventData.end_month && eventData.start_month) {
                                            if (eventData.end_month < eventData.start_month) {
                                                toastWarn("End date cannot be less than start date.");
                                                return;
                                            } else if (
                                                eventData.end_month === eventData.start_month
                                            ) {
                                                if (eventData.end_day && eventData.start_day) {
                                                    if (eventData.end_day < eventData.start_day) {
                                                        toastWarn(
                                                            "End date cannot be less than start date."
                                                        );
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (eventData.id === "") {
                                    createTimelineEventMutation.mutate({ ...TimelineEventCreateDefault, ...eventData, id: uuid(), timeline_id: timeline_id as string })
                                }
                                else {
                                    updateTimelineEventMutation.mutate({
                                        ...eventData,
                                    });
                                }
                                if (closeOnDone) {
                                    setShowDialog(false);
                                    setEventData(TimelineEventCreateDefault);
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
}
