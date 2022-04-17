import { Outlet } from "react-router-dom";
import Navbar from "../Nav/Navbar";
export default function Project() {
  

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
