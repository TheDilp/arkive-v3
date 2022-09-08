import TimelineProvider from "../Context/TimelineContext";
import TimelinesTree from "./TimelinesTree/TimelinesTree";

type Props = {};

export default function Timelines({ }: Props) {
  const events = [
    { id: 1, title: "Event 1", start: "2019-01-01", end: "2019-01-02" },
    { id: 2, title: "Event 2", start: "2019-01-03", end: "2019-01-04" },
    { id: 3, title: "Event 3", start: "2019-01-05", end: "2019-01-06" },
    { id: 4, title: "Event 4", start: "2019-01-07", end: "2019-01-08" },
    { id: 5, title: "Event 5", start: "-450-01-09", end: "-450-01-10" },
  ].sort((a, b) => new Date(a.start) - new Date(b.start));
  return (
    <div className="w-full flex flex-nowrap justify-content-start mainScreen">
      <TimelineProvider>
        <TimelinesTree />
      </TimelineProvider>

    </div>
  );
}
