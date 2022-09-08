import TimelineProvider from "../Context/TimelineContext";
import TimelinesTree from "./TimelinesTree/TimelinesTree";

type Props = {};

export default function Timelines({ }: Props) {

  return (
    <div className="w-full flex flex-nowrap justify-content-start mainScreen">
      <TimelineProvider>
        <TimelinesTree />
      </TimelineProvider>

    </div>
  );
}
