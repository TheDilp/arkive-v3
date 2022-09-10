import { createContext, Dispatch, SetStateAction, useState } from "react";
import { TimelineEventType } from "../../types/TimelineEventTypes";

export const TimelineEventContext = createContext<{
    showCreateDialog: boolean;
    setShowCreateDialog: Dispatch<SetStateAction<boolean>>;
    showUpdateDialog: boolean;
    setShowUpdateDialog: Dispatch<SetStateAction<boolean>>;
    eventData: TimelineEventType | null;
    setEventData: Dispatch<SetStateAction<TimelineEventType | null>>;
}>({
    showCreateDialog: false,
    setShowCreateDialog: () => { },
    showUpdateDialog: false,
    setShowUpdateDialog: () => { },
    eventData: null,
    setEventData: () => { },
});

type Props = {
    children: JSX.Element | JSX.Element[] | null;
};

export default function TimelineEventProvider({ children }: Props) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [eventData, setEventData] = useState<TimelineEventType | null>(null);
    return (
        <TimelineEventContext.Provider
            value={{
                showCreateDialog,
                setShowCreateDialog,
                showUpdateDialog,
                setShowUpdateDialog,
                eventData,
                setEventData,
            }}
        >
            {children}
        </TimelineEventContext.Provider>
    );
}
