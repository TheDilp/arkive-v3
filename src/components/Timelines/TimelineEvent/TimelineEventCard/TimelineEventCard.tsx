import { Card } from "primereact/card";
import { useContext } from "react";
import { TimelineEventType } from "../../../../types/TimelineEventTypes";
import { supabaseStorageImagesLink } from "../../../../utils/utils";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";
import TimelineEventCardSubtitle from "./TimelineEventCardSubtitle";

type Props = {
    eventData: TimelineEventType
}
export default function TimelineEventCard({ eventData }: Props) {
    const { title, start_day, start_month, start_year, end_day, end_month, end_year, image } = eventData;
    const { setShowUpdateDialog, setEventData } = useContext(TimelineEventContext);
    return (
        <div className="h-20rem flex timelineEventCardContainer">

            <Card
                title={() => <div className="timelineCardTitle text-center">{title} <i className="pi pi-pencil" onClick={() => {
                    setEventData(eventData);
                    setShowUpdateDialog(true)
                }}></i></div>}
                subTitle={() => <TimelineEventCardSubtitle start_day={start_day} start_month={start_month} start_year={start_year} end_day={end_day} end_month={end_month} end_year={end_year} />}
                className="w-20rem h-min timelineEventCard"
            >
                {image && (
                    <img
                        src={`${supabaseStorageImagesLink}/${image.link}`}
                        alt={title}
                        width={200}
                        className="shadow-1"
                    />
                )}

            </Card>
        </div>
    );
}
