import { createContext, Dispatch, SetStateAction, useState } from "react";
import { TimelineEventUpdateType } from "../../types/TimelineEventTypes";

export const TimelineEventContext = createContext<{
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;

    eventData: TimelineEventUpdateType | null;
    setEventData: Dispatch<SetStateAction<TimelineEventUpdateType | null>>;
}>({
    showDialog: false,
    setShowDialog: () => { },

    eventData: null,
    setEventData: () => { },
});

type Props = {
    children: JSX.Element | JSX.Element[] | null;
};

export default function TimelineEventProvider({ children }: Props) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [eventData, setEventData] = useState<TimelineEventUpdateType | null>(null);
    return (
        <TimelineEventContext.Provider
            value={{
                showDialog: showCreateDialog,
                setShowDialog: setShowCreateDialog,
                eventData,
                setEventData,
            }}
        >
            {children}
        </TimelineEventContext.Provider>
    );
}
