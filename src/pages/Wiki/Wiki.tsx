import { Outlet } from "react-router-dom";
import DialogWrapper from "../../components/Dialog/DialogWrapper";

export default function Wiki() {
  return (
    <div className="w-full h-full flex flex-1">
      <Outlet />
    </div>
  );
}
