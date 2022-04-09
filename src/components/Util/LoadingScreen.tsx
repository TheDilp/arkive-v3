import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
type Props = {};

export default function LoadingScreen({}: Props) {
  return (
    <div className="w-full h-screen flex justify-content-center align-items-center absolute overflow-hidden">
      <ProgressSpinner
        style={{ width: "150px", height: "150px" }}
        strokeWidth="2"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  );
}
