import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { boardLayouts, changeLayout, toastWarn } from "../../utils/utils";
import { SelectButton } from "primereact/selectbutton";
import { BoardExportProps } from "../../custom-types";
import { InputText } from "primereact/inputtext";
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
  const [exportDialog, setExportDialog] = useState<BoardExportProps>({
    view: "Graph",
    background: "Color",
    type: "PNG",
    show: false,
  });
  const [search, setSearch] = useState("");
  const exportBoardFunction = (
    view: "Graph" | "View",
    background: "Color" | "Transparent",
    type: "PNG" | "JPEG" | "JSON",
    boardTitle?: string
  ) => {
    if (type === "PNG") {
      console.log(cyRef.current);
      saveAs(
        new Blob(
          [
            cyRef.current.png({
              output: "blob",
              bg: background === "Color" ? "#121212" : "transparent",
              full: view === "Graph" ? true : false,
            }),
          ],
          {
            type: "image/png",
          }
        ),
        `${boardTitle || "ArkiveBoard"}.png`
      );
    } else if (type === "JPEG") {
      saveAs(
        new Blob(
          [
            cyRef.current.jpg({
              output: "blob",
              bg: background === "Color" ? "#121212" : "transparent",
              full: view === "Graph" ? true : false,
            }),
          ],
          {
            type: "image/jpg",
          }
        ),
        `${boardTitle || "ArkiveBoard"}.jpg`
      );
    } else if (type === "JSON") {
      saveAs(
        new Blob([JSON.stringify(cyRef.current.json(true))], {
          type: "application/json",
        }),
        `${boardTitle || "ArkiveBoard"}.json`
      );
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      const timeout = setTimeout(() => {
        let foundNodes = cyRef.current
          ?.nodes()
          .filter(`[label ^= '${search}']`);

        if (foundNodes.length === 1) {
          console.log(foundNodes[0].position());
          cyRef.current.center(foundNodes[0]);
        }
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [search]);

  // cy.nodes().filter('[weight > 50]');
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
              options={["PNG", "JPEG", "JSON"]}
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
              onClick={() => {
                if (cyRef.current) {
                  exportBoardFunction(
                    exportDialog.view,
                    exportDialog.background,
                    exportDialog.type,
                    boardTitle
                  );
                } else {
                  toastWarn("Ooops");
                }
              }}
            />
          </div>
        </div>
      </Dialog>
      <div className="relative mr-2">
        <Dropdown
          options={boardLayouts}
          value={layout}
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
        }}
      />
      <InputText value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
  );
}
