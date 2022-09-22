import { Route, Routes } from "react-router-dom";
import TimelineProvider from "../Context/TimelineContext";
import TimelinesTree from "./TimelinesTree/TimelinesTree";
import TimelineView from "./TimelineView";

type Props = {};

export default function Timelines({}: Props) {
  return (
    <div className="w-full flex flex-nowrap justify-content-start mainScreen">
      <TimelineProvider>
        <TimelinesTree />
        <Routes>
          <Route path="/:timeline_id">
            <Route index element={<TimelineView public_view={false} />} />
            <Route
              path=":event_id"
              element={<TimelineView public_view={false} />}
            />
          </Route>
        </Routes>
      </TimelineProvider>
    </div>
  );
}
