import { ProgressSpinner } from "primereact/progressspinner";

export default function LoadingScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ProgressSpinner />
    </div>
  );
}
