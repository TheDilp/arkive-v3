import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction } from "react";
import { TimelineEventType } from "../../../../types/TimelineEventTypes";

type Props = {
    item: TimelineEventType;
    setIconSelect: Dispatch<
        SetStateAction<{
            id?: string;
            show: boolean;
            top: number;
            left: number;
        }>
    >;
    public_view?: boolean;
};

export default function TimelineEventIcon({ item, setIconSelect }: Props) {
    return (
        <div
            className="w-2rem h-2rem border-circle border-1 p-1 flex justify-content-center align-items-center"
            style={{
                borderColor:
                    item.eventBgColor === "#1e1e1e" ? "white" : item.eventBgColor,
            }}
        >
            <Icon
                icon={item.icon}
                color={item.eventBgColor === "#1e1e1e" ? "white" : item.eventBgColor}
                className="w-full h-full cursor-pointer hover:border-green-300"
                onClick={(e) =>
                    setIconSelect((prev) => ({
                        ...prev,
                        id: item.id,
                        show: true,
                        top: e.clientY,
                        left: e.clientX,
                    }))
                }
            />
        </div>
    );
}
