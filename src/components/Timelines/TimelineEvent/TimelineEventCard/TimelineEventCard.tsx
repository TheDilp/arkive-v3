import { Card } from "primereact/card";
import { useContext } from "react";
import { TimelineEventType } from "../../../../types/TimelineEventTypes";
import { supabaseStorageImagesLink } from "../../../../utils/utils";
import { TimelineEventContext } from "../../../Context/TimelineEventContext";

type Props = {
    eventData: TimelineEventType
}
export default function TimelineEventCard({ eventData }: Props) {
    const { title, start_day, start_month, start_year, end_day, end_month, end_year, image } = eventData;
    const { setShowUpdateDialog, setEventData } = useContext(TimelineEventContext);

    const FormattedDate = () => (
        <div className="text-center">
            {start_day ? start_day + "/" : ""}
            {start_month ? start_month + "/" : ""}
            {start_year}
            {(start_day !== end_day ||
                start_month !== end_month ||
                start_year !== end_year) && (
                    <span>
                        - {end_day ? end_day + "/" : ""}
                        {end_month ? end_month + "/" : ""}
                        {end_year}
                    </span>
                )}
        </div>
    );

    return (
        <div className="w-20rem flex flex-wrap justify-content-center timelineEventCardContainer mx-2">
            <div className="relative w-full flex flex-wrap justify-content-center">
                <h3 className="text-center">{title}</h3>
                {image && image.link && (
                    <div className=" flex justify-content-center w-5rem h-5rem bg-white border-circle overflow-hidden">
                        <img
                            src={`${supabaseStorageImagesLink + image.link}`}
                            alt={title}
                            className="w-full h-full"
                            style={{
                                objectFit: "cover"
                            }}
                        />
                    </div>
                )}
            </div>
            {/* <Card
                title={() => <div className="timelineCardTitle text-center">{title} <i className="pi pi-pencil" onClick={() => {
                    setEventData(eventData);
                    setShowUpdateDialog(true)
                }}></i></div>}
                subTitle={() => <FormattedDate />}
                className="w-full timelineEventCard"
            >

            </Card> */}
        </div>
    );
}
