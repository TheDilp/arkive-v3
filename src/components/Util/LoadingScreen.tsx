import { ProgressSpinner } from "primereact/progressspinner";

export default function LoadingScreen() {
  return (
    <div className="w-full h-full flex justify-content-center align-items-center fixed overflow-hidden">
      <ProgressSpinner
        style={{ width: "150px", height: "150px" }}
        strokeWidth="2"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  );
}
