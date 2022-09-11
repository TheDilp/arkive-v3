import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ColorPicker } from "primereact/colorpicker";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
    DocumentProps,
    IconSelectProps,
    ImageProps,
} from "../../../../custom-types";
import { TimelineEventCreateType } from "../../../../types/TimelineEventTypes";
import {
    useCreateTimelineEvent,
    useGetDocuments,
    useGetImages,
} from "../../../../utils/customHooks";
import { TimelineEventCreateDefault } from "../../../../utils/defaultValues";
import { toastWarn } from "../../../../utils/utils";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";
import MarkerIconSelect from "../../../Maps/Map/MapMarker/MarkerIconSelect";
import IconSelectMenu from "../../../Util/IconSelectMenu";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";

export default function TimelineEventCreateDialog() {
    const { project_id, timeline_id } = useParams();
    const { showCreateDialog, setShowCreateDialog } =
        useContext(TimelineEventContext);
    const images = useGetImages(project_id as string);
    const { data: docs } = useGetDocuments(project_id as string);
    const createTimelineEventMutation = useCreateTimelineEvent(
        project_id as string
    );

    const [newEventData, setNewEventData] = useState<
        Omit<TimelineEventCreateType, "id" | "timeline_id">
    >(TimelineEventCreateDefault);
    const [closeOnDone, setCloseOnDone] = useState(true);
    const [iconSelect, setIconSelect] = useState({
        show: false,
        top: 0,
        left: 0,
    });
    return (
        <Dialog
            header="Create Timeline Event"
            visible={showCreateDialog}
            onHide={() => {
                setShowCreateDialog(false);
                setNewEventData(TimelineEventCreateDefault);
            }}
            className="w-3"
            modal={false}
            position="top-left"
        >
            <div className="flex flex-wrap justify-content-center">
                <div className="w-full">
                    <InputText
                        placeholder="Timeline Event Title"
                        className="w-full"
                        value={newEventData.title}
                        onChange={(e) => {
                            setNewEventData((prev) => ({ ...prev, title: e.target.value }));
                        }}
                        autoFocus={true}
                    />
                </div>
                <div className="w-full py-2">
                    <Dropdown
                        value={newEventData.image}
                        itemTemplate={(item: ImageProps) => (
                            <ImgDropdownItem title={item.title} link={item.link} />
                        )}
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
                        options={
                            images?.data.filter((image) => image.type === "Image") || []
                        }
                        onChange={(e) =>
                            setNewEventData((prev) => ({ ...prev, image: e.value }))
                        }
                        placeholder="Timeline Event Image"
                        optionLabel="title"
                        className="w-full"
                    />
                </div>
                <div className="w-full py-2">
                    <Dropdown
                        className="w-full"
                        placeholder="Link Document"
                        value={newEventData.doc_id}
                        filter
                        filterBy="title"
                        onChange={(e) => {
                            let doc = docs?.find((doc: DocumentProps) => doc.id === e.value);
                            if (doc) {
                                setNewEventData((prev) => ({ ...prev, doc_id: doc?.id }));
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
                            value={newEventData.start_day}
                            onChange={(e) =>
                                setNewEventData((prev) => ({
                                    ...prev,
                                    start_day: e.value || undefined,
                                }))
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
                            value={newEventData.start_month}
                            onChange={(e) =>
                                setNewEventData((prev) => ({
                                    ...prev,
                                    start_month: e.value || undefined,
                                }))
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
                            value={newEventData.start_year}
                            onChange={(e) =>
                                setNewEventData((prev) => ({
                                    ...prev,
                                    start_year: e.value || 0,
                                }))
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
                            value={newEventData.end_day}
                            onChange={(e) =>
                                setNewEventData((prev) => ({
                                    ...prev,
                                    end_day: e.value || undefined,
                                }))
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
                            value={newEventData.end_month}
                            onChange={(e) =>
                                setNewEventData((prev) => ({
                                    ...prev,
                                    end_month: e.value || undefined,
                                }))
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
                            value={newEventData.end_year}
                            onChange={(e) =>
                                setNewEventData((prev) => ({ ...prev, end_year: e.value || 0 }))
                            }
                        />
                    </div>
                </div>

                <div className="w-full flex my-4 justify-content-between align-items-center">
                    <span>Event Card Color:</span>
                    <InputText
                        value={newEventData.eventBgColor}
                        onChange={(e) =>
                            setNewEventData((prev) => ({
                                ...prev,
                                eventBgColor:
                                    "#" + e.target.value?.toString().replaceAll("#", ""),
                            }))
                        }
                        prefix="#"
                    />
                    <ColorPicker
                        value={newEventData.eventBgColor}
                        onChange={(e) =>
                            setNewEventData((prev) => ({
                                ...prev,
                                eventBgColor: ("#" +
                                    e.value?.toString().replaceAll("#", "")) as string,
                            }))
                        }
                    />
                </div>
                <div className="w-full flex my-4 justify-content-between align-items-center">
                    <span>Event Icon:</span>{" "}
                    <Icon
                        className="cursor-pointer border-blue-300 border-2 border-circle w-2rem h-2rem p-1"
                        fontSize={20}
                        icon={newEventData.icon || "mdi:chart-timeline-variant"}
                        color={newEventData.eventBgColor}
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
                            setNewEventData((prev) => ({
                                ...prev,
                                icon,
                            }))
                        }
                        setIconSelect={setIconSelect}
                    />
                </div>
                <div className="w-full flex flex-wrap my-4 justify-content-between align-items-center">
                    <span className="w-full mb-1">
                        Character Count: {newEventData.description?.length || 0}
                    </span>
                    <InputTextarea
                        value={newEventData.description}
                        onChange={(e) =>
                            setNewEventData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        className="w-full resize-none"
                        placeholder="Timeline Event Description (max 250 characters)"
                        rows={4}
                        maxLength={250}
                    />
                </div>
                <div className="w-full flex my-4 justify-content-between align-items-center">
                    <span>Close Dialog on Done:</span>
                    <Checkbox
                        checked={closeOnDone}
                        onChange={(e) => setCloseOnDone(e.checked)}
                    />
                </div>
                <div className="w-full flex justify-content-end">
                    <Button
                        label="Create Event"
                        className="p-button-success p-button-outlined p-button-raised"
                        icon="pi pi-plus"
                        iconPos="right"
                        type="submit"
                        onClick={async () => {
                            if (newEventData.end_year && newEventData.start_year) {
                                if (newEventData.end_year < newEventData.start_year) {
                                    toastWarn("End date cannot be less than start date.");
                                    return;
                                } else if (newEventData.end_year === newEventData.start_year) {
                                    if (newEventData.end_month && newEventData.start_month) {
                                        if (newEventData.end_month < newEventData.start_month) {
                                            toastWarn("End date cannot be less than start date.");
                                            return;
                                        } else if (
                                            newEventData.end_month === newEventData.start_month
                                        ) {
                                            if (newEventData.end_day && newEventData.start_day) {
                                                if (newEventData.end_day < newEventData.start_day) {
                                                    toastWarn("End date cannot be less than start date.");
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            await createTimelineEventMutation.mutateAsync({
                                id: uuid(),
                                ...newEventData,
                                timeline_id: timeline_id as string,
                            });
                            setNewEventData(TimelineEventCreateDefault);
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
}
