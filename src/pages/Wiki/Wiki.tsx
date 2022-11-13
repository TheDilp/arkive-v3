import { Outlet } from "react-router-dom";

export default function Wiki() {
  return (
    <div className="h-full flex flex-1">
      <div className="flex-1">
        <Outlet />
      </div>
      <div className="w-1/6 flex flex-col bg-zinc-800">
        <div className="h-10 border-b border-zinc-600"></div>
      </div>
    </div>
  );
}
