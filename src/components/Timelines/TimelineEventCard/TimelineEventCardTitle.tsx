type Props = {
    title: string;
}

export default function TimelineEventCardTitle({ title }: Props) {
    return (
        <div className="timelineCardTitle">{title} <i className="pi pi-pencil"></i></div>
    )
}