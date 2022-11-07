import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

export default function Wiki({}: Props) {
  return (
    <div>
      <Outlet />
    </div>
  );
}
