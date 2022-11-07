import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

export default function Wiki({}: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-red-500 flex-grow-1">
      kajslk
      <Outlet />
    </div>
  );
}
