import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../../../custom-types";
import { TimelineEventUpdateType } from "../../../../types/TimelineEventTypes";
import { useGetImages, useUpdateTimelineEvent } from "../../../../utils/customHooks";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";


export default function TimelineEventUpdateDialog() {
    const { showUpdateDialog, setShowUpdateDialog, eventData, setEventData } = useContext(TimelineEventContext)
    const { project_id } = useParams()
    const images = useGetImages(project_id as string)
    const updateTimelineEventMutation = useUpdateTimelineEvent(project_id as string);
    const [closeOnDone, setCloseOnDone] = useState(true)
    return (
        <Dialog
            header="Update Timeline Event"
            visible={showUpdateDialog}
            onHide={() => setShowUpdateDialog(false)}
            className="w-3"
        >

            {eventData && <div className="flex flex-wrap justify-content-center">
                <div className="w-full">
                    <InputText
                        placeholder="Timeline Event Title"
                        className="w-full"
                        value={eventData.title}
                        onChange={(e) => {
                            setEventData((prev) => ({ ...prev, title: e.target.value } as TimelineEventUpdateType))
                        }}
                        autoFocus={true}
                    />
                </div>
                <div className="w-full py-2">
                    <Dropdown
                        value={eventData.image}
                        filter
                        itemTemplate={(item: ImageProps) => (
                            <ImgDropdownItem title={item.title} link={item.link} />
                        )}
                        options={images?.data.filter((image) => image.type === "Image") || []}
                        onChange={(e) =>
                            setEventData((prev) => ({ ...prev, image: e.value } as TimelineEventUpdateType))
                        }
                        virtualScrollerOptions={{
                            lazy: true, onLazyLoad: () => { }, itemSize: 50, showLoader: true, loading: images?.data.length === 0, delay: 0, loadingTemplate: (options) => {
                                return (
                                    <div className="flex align-items-center p-2" style={{ height: '38px' }}>
                                    </div>
                                )
                            }
                        }}
                        placeholder="Timeline Event Image"
                        optionLabel="title"
                        className="w-full"
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
                                setEventData((prev) => ({ ...prev, start_day: e.value || undefined }) as TimelineEventUpdateType)
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
                                setEventData((prev) => ({ ...prev, start_month: e.value || undefined }) as TimelineEventUpdateType)
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
                                setEventData((prev) => ({ ...prev, start_year: e.value || 0 }) as TimelineEventUpdateType)
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
                                setEventData((prev) => ({ ...prev, end_day: e.value || undefined }) as TimelineEventUpdateType)
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
                                setEventData((prev) => ({ ...prev, end_month: e.value || undefined }) as TimelineEventUpdateType)
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
                                setEventData((prev) => ({ ...prev, end_year: e.value || 0 }) as TimelineEventUpdateType)
                            }
                        />
                    </div>
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
                        onClick={() => {
                            updateTimelineEventMutation.mutate({
                                ...eventData,
                            });
                            if (closeOnDone) {
                                setShowUpdateDialog(false)
                                setEventData(null);
                            }
                        }
                        }
                    />
                </div>
            </div>}
        </Dialog>
    );
}
