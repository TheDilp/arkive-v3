import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { TimelineEventType } from "../../../types/TimelineEventTypes";
import { supabaseStorageImagesLink } from "../../../utils/utils";
import TimelineEventCardSubtitle from "./TimelineEventCardSubtitle";
import TimelineEventCardTitle from "./TimelineEventCardTitle";

export default function TimelineEventCard({
    title,
    image,
    start_day,
    start_month,
    start_year,
    end_day,
    end_month,
    end_year,
}: TimelineEventType) {
    return (
        <Card
            title={() => <TimelineEventCardTitle title={title} />}
            subTitle={() => <TimelineEventCardSubtitle start_day={start_day} start_month={start_month} start_year={start_year} end_day={end_day} end_month={end_month} end_year={end_year} />}
            className="w-20rem h-20rem timelineEventCard"
        >
            {image && (
                <img
                    src={`${supabaseStorageImagesLink}/${image.link}`}
                    alt={title}
                    width={200}
                    className="shadow-1"
                />
            )}
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
                consequuntur error repudiandae numquam deserunt quisquam repellat libero
                asperiores earum nam nobis, culpa ratione quam perferendis esse,
                cupiditate neque quas!
            </p>
            <Button label="Edit event" className="p-button-text" />
        </Card>
    );
}
