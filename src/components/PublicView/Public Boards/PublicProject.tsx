import { Outlet } from "react-router-dom";


export default function PublicProject() {
 
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
