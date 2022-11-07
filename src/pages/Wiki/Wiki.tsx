import { Outlet } from "react-router-dom";

type Props = {};

export default function Wiki({}: Props) {
  return (
    <div className="w-full h-full flex flex-grow-1">
      <Outlet />
    </div>
  );
}
