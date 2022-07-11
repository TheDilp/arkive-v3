import { ColorPicker } from "primereact/colorpicker";
import { Tooltip } from "primereact/tooltip";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
  changeLockState,
  nodeColorPresets,
  updateColor,
} from "../../utils/boardUtils";
import { useUpdateEdge, useUpdateNode } from "../../utils/customHooks";
type Props = {
  cyRef: any;
};

export default function BoardQuickBar({ cyRef }: Props) {
  const { project_id, board_id } = useParams();
  const updateNodeMutation = useUpdateNode(project_id as string);
  const updateEdgeMutation = useUpdateEdge(project_id as string);

  const debounced = useDebouncedCallback(
    // function
    (color) => {
      updateColor(
        cyRef,
        `#${color}`,
        board_id as string,
        updateNodeMutation,
        updateEdgeMutation
      );
    },
    // delay in ms
    400
  );

  return (
    <div
      className="w-2 absolute border-round surface-50 text-white h-3rem flex align-items-center justify-content-around shadow-5"
      style={{
        top: "95.6vh",
        left: "50%",
        zIndex: 5,
      }}
    >
      <Tooltip
        target={".lockSelected"}
        content="Lock selected nodes"
        position="top"
        autoHide={true}
      />
      <Tooltip
        target={".unlockSelected"}
        content="Unlock selected nodes"
        position="top"
        autoHide={true}
      />
      <Tooltip
        target={".deleteSelected"}
        content="Delete selected elements"
        position="top"
        autoHide={true}
      />
      <Tooltip
        target={".colorPresets"}
        position="top"
        autoHide={false}
        hideEvent="focus"
      >
        <div className="flex flex-wrap w-10rem">
          {nodeColorPresets.map((color) => (
            <div
              key={color}
              className="w-1rem h-1rem border-rounded cursor-pointer"
              style={{
                backgroundColor: `#${color}`,
              }}
              onClick={() => {
                updateColor(
                  cyRef,
                  `#${color}`,
                  board_id as string,
                  updateNodeMutation,
                  updateEdgeMutation
                );
              }}
            ></div>
          ))}
        </div>
      </Tooltip>
      <Tooltip
        target={".resetColors"}
        content="Reset selected to default color"
        position="top"
        autoHide={true}
      />
      <Tooltip
        target={".pickColor"}
        content="Pick color for selected elements"
        position="top"
      />
      <i
        className="pi pi-fw pi-lock cursor-pointer hover:text-blue-300 lockSelected"
        onClick={() => changeLockState(cyRef, true)}
      ></i>
      <i
        className="pi pi-fw pi-lock-open cursor-pointer hover:text-blue-300 unlockSelected"
        onClick={() => changeLockState(cyRef, false)}
      ></i>
      <i className="pi pi-fw pi-trash cursor-pointer hover:text-blue-300 deleteSelected"></i>
      <i
        className="pi pi-fw pi-refresh cursor-pointer hover:text-blue-300 resetColors"
        onClick={() =>
          updateColor(
            cyRef,
            "#595959",
            board_id as string,
            updateNodeMutation,
            updateEdgeMutation
          )
        }
      ></i>
      <i
        className="pi pi-fw pi-palette cursor-pointer hover:text-blue-300 colorPresets"
        onClick={() => {}}
      ></i>
      <ColorPicker
        onChange={(e) => {
          debounced(e.target.value);
        }}
        className="w-2rem h-2rem"
        defaultColor="595959"
      ></ColorPicker>
    </div>
  );
}
