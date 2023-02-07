import { Button } from "primereact/button";

export default function RandomTableView() {
  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex w-full items-center gap-y-2 gap-x-2 ">
        <Button className="p-button-outlined w-fit" icon="pi pi-plus" iconPos="right" label="Add option" />
      </div>
    </div>
  );
}
