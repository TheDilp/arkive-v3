import { Outlet, useParams } from "react-router-dom";
import Navbar from "../Nav/Navbar";
export default function Project() {
  const { project_id } = useParams();

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
