import React from "react";
import { Navigate } from "react-router-dom";
import { toastError } from "../../utils/utils";

type Props = {};

export default function NotFound({ }: Props) {
  console.log(window.location.href)
  toastError("Route not found!");
  return null;
}
