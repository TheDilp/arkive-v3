import React from "react";
import { Navigate } from "react-router-dom";
import { toastError } from "../../utils/utils";

type Props = {};

export default function NotFound({ }: Props) {
  toastError("Route not found!");
  return <Navigate to="/" />;
}
