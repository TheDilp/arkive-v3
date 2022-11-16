import { Outlet } from "react-router-dom";
import PropertiesBar from "../../components/PropertiesBar/PropertiesBar";

export default function Wiki() {
  return (
    <div className="h-full flex flex-1">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
