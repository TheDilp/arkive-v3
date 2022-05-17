import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { boardLayouts, changeLayout } from "../../utils/utils";
import { SelectButton } from "primereact/selectbutton";
type Props = {
  layout: string | null | undefined;
  setLayout: (layout: string) => void;
  drawMode: boolean;
  setDrawMode: (drawMode: boolean | ((prev: boolean) => boolean)) => void;
  snap: boolean;
  setSnap: (snap: boolean | ((prev: boolean) => boolean)) => void;
  cyRef: any;
  ehRef: any;
  boardTitle: string | undefined;
};

export default function BoardBar({
  layout,
  setLayout,
  drawMode,
  setDrawMode,
  snap,
  setSnap,
  cyRef,
  ehRef,
  boardTitle,
}: Props) {
  const [exportDialog, setExportDialog] = useState({
    view: "Graph",
    background: "Color",
    type: "PNG",
    show: false,
  });
  return (
    <div className="absolute flex flex-nowrap z-5">
      <Dialog
        header={`Export Board - ${boardTitle}`}
        modal={false}
        position="top-left"
        style={{
          maxWidth: "14vw",
        }}
        visible={exportDialog.show}
        onHide={() =>
          setExportDialog({
            view: "Graph",
            background: "Color",
            type: "PNG",
            show: false,
          })
        }
      >
        <div className="flex flex-wrap">
          <div className="w-full flex flex-wrap justify-content-center">
            <h3 className="w-full text-center mb-1 mt-0">View</h3>
            <SelectButton
              value={exportDialog.view}
              options={["Graph", "Current"]}
              onChange={(e) =>
                setExportDialog({ ...exportDialog, view: e.value })
              }
            />
          </div>
          <div className="w-full flex flex-wrap justify-content-center">
            <h3 className="my-2">Background</h3>
            <SelectButton
              value={exportDialog.background}
              options={["Color", "Transparent"]}
              onChange={(e) =>
                setExportDialog({ ...exportDialog, background: e.value })
              }
            />
          </div>
          <div className="w-full flex flex-wrap justify-content-center">
            <h3 className="my-2">File Type</h3>
            <SelectButton
              value={exportDialog.type}
              options={["PNG", "JPEN", "JSON"]}
              onChange={(e) =>
                setExportDialog({ ...exportDialog, type: e.value })
              }
            />
          </div>
          <div className="w-full flex justify-content-center mt-2">
            <Button
              label="Export"
              className="p-button-outlined p-button-success"
              icon="pi pi-download"
              iconPos="right"
            />
          </div>
        </div>
      </Dialog>
      <div className="relative mr-2">
        <Dropdown
          options={boardLayouts}
          value={layout || "Preset"}
          onChange={(e) => {
            setLayout(e.value);
            changeLayout(e.value as string, cyRef);
            cyRef.current.fit();
          }}
        />
      </div>
      <Button
        className={`p-button-rounded  ${
          drawMode ? "p-button-success" : "p-button-secondary"
        }`}
        icon="pi pi-pencil"
        onClick={() => {
          setDrawMode((prev: boolean) => {
            if (prev) {
              ehRef.current.disable();
              ehRef.current.disableDrawMode();
              cyRef.current.autoungrabify(false);
              cyRef.current.autounselectify(false);
              cyRef.current.autolock(false);
              cyRef.current.zoomingEnabled(true);
              cyRef.current.userZoomingEnabled(true);
              cyRef.current.panningEnabled(true);
              setDrawMode(false);
            } else {
              ehRef.current.enable();
              ehRef.current.enableDrawMode();
              setDrawMode(true);
            }
            return !prev;
          });
        }}
        tooltip="Draw Mode"
      />
      <Button
        className={`p-button-rounded mx-2 ${
          snap ? "p-button-success" : "p-button-secondary"
        }`}
        icon="pi pi-th-large"
        tooltip="Snapping"
        onClick={() => {
          setSnap((prev) => {
            return !prev;
          });
        }}
      />
      <Button
        icon="pi pi-save"
        onClick={() => {
          setExportDialog({ ...exportDialog, show: true });
          //   saveAs(
          //     new Blob(
          //       [
          //         cyRef.current.png({
          //           output: "blob",
          //           bg: "#121212",
          //           full: true,
          //         }),
          //       ],
          //       {
          //         type: "image/png",
          //       }
          //     ),
          //     `${boardTitle || "ArkiveBoard"}.png`
          //   );
        }}
      />
    </div>
  );
}
