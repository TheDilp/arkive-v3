import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateTimelineEvent, useGetImages } from "../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ImgDropdownItem from "../Util/ImgDropdownItem";
import { ImageProps } from "../../custom-types";
import { TimelineEventCreateDefault } from "../../utils/defaultValues";
import { TimelineEventCreateType } from "../../types/TimelineEventTypes";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
type Props = {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
};

export default function TimelineEventDialog({
    showDialog,
    setShowDialog,
}: Props) {
    const { project_id, timeline_id } = useParams();
    const images = useGetImages(project_id as string);
    const createTimelineEventMutation = useCreateTimelineEvent(
        project_id as string
    );

    const [newEventData, setNewEventData] = useState<
        Omit<TimelineEventCreateType, "id" | "timeline_id">
    >(TimelineEventCreateDefault);
    const [closeOnDone, setCloseOnDone] = useState(true);
    return (
        <Dialog
            header="Create Timeline Event"
            visible={showDialog}
            onHide={() => setShowDialog(false)}
            className="w-3"
        >
            <div className="flex flex-wrap justify-content-center">
                <div className="w-8">
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
                <div className="w-8 py-2">
                    <Dropdown
                        value={newEventData.image}
                        itemTemplate={(item: ImageProps) => (
                            <ImgDropdownItem title={item.title} link={item.link} />
                        )}
                        options={images?.data.filter((image) => image.type === "Map") || []}
                        onChange={(e) =>
                            setNewEventData((prev) => ({ ...prev, image: e.value }))
                        }
                        placeholder="Timeline Event Image"
                        optionLabel="title"
                        className="w-full"
                    />
                </div>

                {/* Start date fields */}
                <div className="w-full flex justify-content-between">
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
                                setNewEventData((prev) => ({ ...prev, start_day: e.value || undefined }))
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
                                setNewEventData((prev) => ({ ...prev, start_month: e.value || undefined }))
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
                                setNewEventData((prev) => ({ ...prev, start_year: e.value || 0 }))
                            }
                        />
                    </div>
                </div>
                {/* End date fields */}
                <div className="w-full flex justify-content-between">
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
                                setNewEventData((prev) => ({ ...prev, end_day: e.value || undefined }))
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
                                setNewEventData((prev) => ({ ...prev, end_month: e.value || undefined }))
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

                <div className="w-8 flex mb-2 justify-content-between  align-items-center">
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
                            await createTimelineEventMutation.mutateAsync({
                                id: uuid(),
                                ...newEventData,
                                timeline_id: timeline_id as string,
                            });
                            setNewEventData(TimelineEventCreateDefault);
                        }
                        }
                    />
                </div>
            </div>
        </Dialog>
    );
}
