import { Outlet } from "react-router-dom";
import TagsAutocomplete from "../../components/PropertiesBar/DocumentProperties";

export default function Wiki() {
  return (
    <div className="h-full flex flex-1">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
