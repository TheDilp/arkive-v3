import { createContext, Dispatch, SetStateAction, useState } from "react";

export const TimelineContext = createContext<{
    timelineId: string;
    setTimelineId: Dispatch<SetStateAction<string>>;
}>({ timelineId: "", setTimelineId: () => { } })

type Props = {
    children: JSX.Element | JSX.Element[] | null
}

export default function TimelineProvider({ children }: Props) {
    const [timelineId, setTimelineId] = useState("")
    return (
        <TimelineContext.Provider value={{
            timelineId, setTimelineId,
        }}>{children}</TimelineContext.Provider>
    )
}