import { Button } from 'primereact/button'
import { Dispatch, SetStateAction } from 'react'

type Props = {
    view: { details: boolean, horizontal: boolean };
    setShowTimelineEventDialog: Dispatch<SetStateAction<boolean>>
    setView: Dispatch<SetStateAction<{ details: boolean, horizontal: boolean }>>
}

export default function TimelineQuickBar({ view, setShowTimelineEventDialog, setView }: Props) {
    return (
        <div
            className="w-2 absolute border-round surface-50 text-white h-3rem flex align-items-center justify-content-around shadow-5"
            style={{
                top: "95.6vh",
                left: "50%",
                zIndex: 5,
            }}
        >
            <Button className={`p-button-text w-3rem h-3rem ${view.details && "p-button-secondary"}`} icon="pi pi-circle" tooltip="Simple View" tooltipOptions={{ position: "top" }}
                onClick={() => setView(prev => ({ ...prev, details: false }))}
            />
            <Button className={`p-button-text w-3rem h-3rem ${!view.details && "p-button-secondary"}`} icon="pi pi-id-card" tooltip="Detailed View" tooltipOptions={{ position: "top" }}
                onClick={() => setView(prev => ({ ...prev, details: true }))}
            />
            <Button className="p-button-text w-3rem h-3rem" icon="pi pi-plus" tooltip="New Event" tooltipOptions={{ position: "top" }}
                onClick={() => setShowTimelineEventDialog(true)}
            />
            <Button className={`p-button-text w-3rem h-3rem ${!view.horizontal && "p-button-secondary"}`} icon="pi pi-arrows-h" tooltip="Horizontal View" tooltipOptions={{ position: "top" }}
                onClick={() => setView(prev => ({ ...prev, horizontal: true }))}
            />
            <Button className={`p-button-text w-3rem h-3rem ${view.horizontal && "p-button-secondary"}`} icon="pi pi-arrows-v" tooltip="Vertical View" tooltipOptions={{ position: "top" }}
                onClick={() => setView(prev => ({ ...prev, horizontal: false }))}
            />
        </div>
    )
}