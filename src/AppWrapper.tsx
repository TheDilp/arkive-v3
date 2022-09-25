import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/primereact.min.css"; //core css
import { Outlet } from "react-router-dom";
type Props = {};

export default function AppWrapper() {
  return <Outlet />;
}
