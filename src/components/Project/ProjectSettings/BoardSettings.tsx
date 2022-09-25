import { Slider } from "primereact/slider";
import React, { useState } from "react";
import { ProjectProps } from "../../../custom-types";
import { useUpdateProject } from "../../../utils/customHooks";

type Props = {
  project: ProjectProps;
};

export default function BoardSettings({ project }: Props) {
  const [boardSettings, setBoardSettings] = useState(project.board_settings);
  const updateProjectMutation = useUpdateProject();
  return (
    <div className="flex flex-column Lato p-4">
      <div className="w-4 flex flex-wrap">
        <div className="w-full text-xl font-bold">Zoom wheel sensitivity</div>
        <div className="text-gray-300 text-sm mb-2">
          Determines how much you zoom in the board
        </div>

        <div className="w-full flex flex-wrap">
          <label className="w-full pb-2">
            Current sensitivity: {boardSettings.wheelSensitivity}
            <span className="text-gray-300 text-sm pl-2">(Default is 1)</span>
          </label>
          <Slider
            className="w-full"
            value={boardSettings.wheelSensitivity}
            onChange={(e) =>
              setBoardSettings((prev) => ({
                ...prev,
                wheelSensitivity: e.value as number,
              }))
            }
            onSlideEnd={() =>
              updateProjectMutation.mutate({
                project_id: project.id,
                board_settings: boardSettings,
              })
            }
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
}
