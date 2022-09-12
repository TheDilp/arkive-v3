import { useNavigate } from 'react-router-dom'
import { TimelineEventType } from '../../../types/TimelineEventTypes'

export default function SimpleTimelineEvent({ title, start_day, start_month, start_year, end_day, end_month, end_year, doc_id }: Pick<TimelineEventType, "title" | "doc_id" | "start_day" | "start_month" | "start_year" | "end_day" | "end_month" | "end_year">) {
    const navigate = useNavigate()
    return (
        <div className={`simple-event ${doc_id ? "cursor-pointer" : ""}`} onClick={() => {
            if (doc_id) navigate(`../../../wiki/doc/${doc_id}`)
        }}>
            <h4 className='m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis'>
                {title}
            </h4>
            <h5 className="m-0">{start_day ? start_day + "/" : ""}{start_month ? start_month + "/" : ""}{start_year} - {end_day ? end_day + "/" : ""}
                {end_month ? end_month + "/" : ""}
                {end_year}</h5>
        </div>
    )
}