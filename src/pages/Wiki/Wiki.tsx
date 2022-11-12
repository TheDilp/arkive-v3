import { Outlet } from "react-router-dom";

export default function Wiki() {
  return (
    <div className="w-full h-full flex flex-1">
      <Outlet />
    </div>
  );
}
