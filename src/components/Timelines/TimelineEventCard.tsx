import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { TimelineEventType } from '../../types/TimelineEventTypes'
import { supabaseStorageImagesLink } from '../../utils/utils'


export default function TimelineEventCard({ title, image, start_day, start_month, start_year, end_day, end_month, end_year }: TimelineEventType) {
    return (
        <Card title={title} subTitle={`${start_day || ""}/${start_month || ""}/${start_year} - ${end_day || ""}/${end_month || ""}/${end_year}`} className="w-20rem h-20rem">
            {image && <img src={`${supabaseStorageImagesLink}/${image.link}`} alt={title} width={200} className="shadow-1" />}
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
            <Button label="Read more" className="p-button-text"></Button>
        </Card>
    )
}