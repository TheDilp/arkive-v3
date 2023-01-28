import { useAtom } from "jotai";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { useState } from "react";

import { BoardExportType } from "../../types/ItemTypes/boardTypes";
import { BoardReferenceAtom, DialogAtom } from "../../utils/Atoms/atoms";
import { exportBoardFunction } from "../../utils/boardUtils";
import { toaster } from "../../utils/toast";

export default function ExportBoard() {
  const [boardRef] = useAtom(BoardReferenceAtom);
  const [dialog] = useAtom(DialogAtom);
  const [exportSettings, setExportSettings] = useState<BoardExportType>({ view: "Graph", background: "Color", type: "PNG" });
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex w-full flex-col items-center">
        <h3 className="mb-1 mt-0 w-full text-center">View</h3>
        <SelectButton
          onChange={(e) => setExportSettings({ ...exportSettings, view: e.value })}
          options={["Graph", "Current"]}
          value={exportSettings.view}
        />
      </div>
      <div className="flex w-full flex-col items-center">
        <h3 className="my-2">Background</h3>
        <SelectButton
          onChange={(e) => setExportSettings({ ...exportSettings, background: e.value })}
          options={["Color", "Transparent"]}
          value={exportSettings.background}
        />
      </div>
      <div className="flex w-full flex-col items-center">
        <h3 className="my-2">File Type</h3>
        <SelectButton
          onChange={(e) => setExportSettings({ ...exportSettings, type: e.value })}
          options={["PNG", "JPEG", "JSON"]}
          value={exportSettings.type}
        />
      </div>
      <div className="mt-2 flex w-full justify-center">
        <Button
          className="p-button-outlined p-button-success"
          icon="pi pi-download"
          iconPos="right"
          label="Export"
          onClick={() => {
            if (boardRef) {
              exportBoardFunction(
                boardRef,
                exportSettings.view,
                exportSettings.background,
                exportSettings.type,
                dialog.data?.title,
              );
            } else {
              toaster("error", "There was an error exporting your board.");
            }
          }}
        />
      </div>
    </div>
  );
}
