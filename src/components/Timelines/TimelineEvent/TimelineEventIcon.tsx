import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  id: string;
  eventBgColor: string;
  age_color?: string;
  icon: string;
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

export default function TimelineEventIcon({
  id,
  eventBgColor,
  icon,
  setIconSelect,
}: Props) {
  return (
    <div
      className="w-2rem h-2rem border-circle border-1 p-1 flex justify-content-center align-items-center"
      style={{
        borderColor:
          eventBgColor.toLowerCase() === "#1e1e1e" ? "white" : eventBgColor,
      }}
    >
      <Icon
        icon={icon}
        color={
          eventBgColor.toLowerCase() === "#1e1e1e" ? "white" : eventBgColor
        }
        className="w-full h-full cursor-pointer hover:border-green-300"
        onClick={(e) =>
          setIconSelect((prev) => ({
            ...prev,
            id: id,
            show: true,
            top: e.clientY,
            left: e.clientX,
          }))
        }
      />
    </div>
  );
}
