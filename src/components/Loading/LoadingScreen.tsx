import { ProgressSpinner } from "primereact/progressspinner";

export default function LoadingScreen() {
  return (
    <div className="h-full w-full">
      <ProgressSpinner />
    </div>
  );
}
