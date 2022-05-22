import { Outlet, useParams } from "react-router-dom";

type Props = {};

export default function PublicProject({}: Props) {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
