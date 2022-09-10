import { Card } from "primereact/card";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEventType } from "../../../../types/TimelineEventTypes";
import { supabaseStorageImagesLink } from "../../../../utils/utils";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";
import TimelineEventCardSubtitle from "./TimelineEventCardSubtitle";

type Props = {
    eventData: TimelineEventType
}
export default function TimelineEventCard({ eventData }: Props) {
    const { title, start_day, start_month, start_year, end_day, end_month, end_year, image, doc_id } = eventData;
    const { setShowUpdateDialog, setEventData } = useContext(TimelineEventContext);
    const navigation = useNavigate();
    return (
        <div className="h-20rem flex timelineEventCardContainer">
            <Card
                title={() => <div className="timelineCardTitle text-center">{title} <i className="pi pi-pencil" onClick={() => {
                    setEventData(eventData);
                    setShowUpdateDialog(true)
                }}></i></div>}
                subTitle={() => <TimelineEventCardSubtitle start_day={start_day} start_month={start_month} start_year={start_year} end_day={end_day} end_month={end_month} end_year={end_year} />}
                className={`w-20rem h-min timelineEventCard ${doc_id && "cursor-pointer linkTimelineEventCard"}`}
                onClick={() => {
                    if (doc_id)
                        navigation(`../../../wiki/doc/${doc_id}`)
                }}
            >
                <div className="w-full h-full flex justify-content-center">

                    {image && (
                        <img
                            src={`${supabaseStorageImagesLink}/${image.link}`}
                            alt={title}
                            className="w-full h-8rem"
                            style={{
                                objectFit: "contain"
                            }}
                        />
                    )}
                </div>

            </Card>
        </div >
    );
}
