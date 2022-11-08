import { Outlet } from "react-router-dom";
import DialogWrapper from "../../components/Dialog/DialogWrapper";

type Props = {};

export default function Wiki({}: Props) {
  return (
    <div className="w-full h-full flex flex-grow-1">
      <DialogWrapper />
      <Outlet />
    </div>
  );
}
