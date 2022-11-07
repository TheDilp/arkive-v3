import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

type Props = {};

export default function Layout({}: Props) {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}
