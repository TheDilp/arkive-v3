type Props = {
    title: string;
}

export default function TimelineEventCardTitle({ title }: Props) {
    return (
        <div className="timelineCardTitle text-center">{title} <i className="pi pi-pencil"></i></div>
    )
}