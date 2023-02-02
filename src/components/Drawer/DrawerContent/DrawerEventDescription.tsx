import React from "react";

type Props = {};

export default function DrawerEventDescription({}: Props) {
  return (
    <div>
      <h2 className="sticky top-0 bg-zinc-800 pb-2 font-Lato text-2xl">Some event title</h2>
      <hr className="my-2 border-zinc-700" />
    </div>
  );
}
