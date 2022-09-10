import React from 'react'
import { TimelineEventType } from '../../../types/TimelineEventTypes'

export default function SimpleTimelineEvent({ title, start_day, start_month, start_year, end_day, end_month, end_year }: Pick<TimelineEventType, "title" | "start_day" | "start_month" | "start_year" | "end_day" | "end_month" | "end_year">) {
    return (
        <div className="simple-event">
            <h4 className='m-0'>
                {title}
            </h4>
            <h5 className="m-0">{start_day ? start_day + "/" : ""}{start_month ? start_month + "/" : ""}{start_year} - {end_day ? end_day + "/" : ""}
                {end_month ? end_month + "/" : ""}
                {end_year}</h5>
        </div>
    )
}