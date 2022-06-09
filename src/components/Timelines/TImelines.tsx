import { Icon } from "@iconify/react";
import { Card } from "primereact/card";
import React from "react";
import ItemTree from "../ItemTree";

type Props = {};

export default function Timelines({}: Props) {
  const header = (
    <img
      className="w-full h-15rem"
      style={{
        objectFit: "cover",
      }}
      alt="Card"
      src="https://i.imgur.com/5F1YC44.png"
    />
  );
  const events = [
    { id: 1, title: "Event 1", start: "2019-01-01", end: "2019-01-02" },
    { id: 2, title: "Event 2", start: "2019-01-03", end: "2019-01-04" },
    { id: 3, title: "Event 3", start: "2019-01-05", end: "2019-01-06" },
    { id: 4, title: "Event 4", start: "2019-01-07", end: "2019-01-08" },
    { id: 5, title: "Event 5", start: "-450-01-09", end: "-450-01-10" },
  ].sort((a, b) => new Date(a.start) - new Date(b.start));
  return (
    <div className="text-white w-full h-screen flex flex-wrap overflow-y-auto">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`w-full relative flex flex-nowrap justify-content-around ${
            index % 2 === 0 ? "evenTimelineEvent" : "oddTimelineEvent"
          }`}
        >
          {index % 2 === 0 && (
            <div className="absolute z-5 evenDivider">
              <Icon icon="mdi:checkbox-blank-circle" fontSize={30} />
            </div>
          )}
          {index % 2 !== 0 && (
            <div className="absolute z-5 oddDivder">
              <Icon icon="mdi:checkbox-blank-circle" fontSize={30} />
            </div>
          )}
          <div className="cardContainer relative">
            <Card
              title={event.title}
              subTitle={`${event.start} - ${event.end}`}
              style={{ width: "25rem" }}
              header={header}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
