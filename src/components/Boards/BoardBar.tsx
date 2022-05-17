import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { boardLayouts, changeLayout } from "../../utils/utils";

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
  return (
    <div className="absolute flex flex-nowrap z-5">
      <div className="relative">
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
          saveAs(
            new Blob(
              [
                cyRef.current.png({
                  output: "blob",
                  bg: "#121212",
                  full: true,
                }),
              ],
              {
                type: "image/png",
              }
            ),
            `${boardTitle || "ArkiveBoard"}.png`
          );
        }}
      />
    </div>
  );
}
