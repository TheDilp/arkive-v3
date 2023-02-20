/* eslint-disable jsx-a11y/control-has-associated-label */
import { useAtom } from "jotai";
import { InputText } from "primereact/inputtext";
import { HexColorPicker } from "react-colorful";

import { ProjectAtom } from "../../utils/Atoms/atoms";
import { DefaultSwatches } from "../../utils/DefaultValues/ProjectDefaults";
import DefaultTooltip from "../Tooltip/DefaultTooltip";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  color: string;
  name: string;
  hasInput?: boolean;
  isDisabled?: boolean;
  onChange: ({ name, value }: { name: string; value: string }) => void;
  onEnter?: () => void;
};

export default function ColorInput({ name, color, isDisabled, onChange, hasInput, onEnter }: Props) {
  const [projectData] = useAtom(ProjectAtom);
  return (
    <div className="relative flex w-full items-center justify-between">
      <Tooltip
        content={
          <div className="w-full">
            <HexColorPicker
              color={color}
              onChange={(newColor) => {
                onChange({ name, value: newColor });
              }}
            />
            <div className="flex w-full flex-wrap gap-x-2 bg-zinc-900 p-1">
              {projectData?.swatches?.length
                ? projectData.swatches.map((swatch) => (
                    <Tooltip
                      content={swatch?.title ? <DefaultTooltip>{swatch.title}</DefaultTooltip> : "TEST"}
                      customOffset={{
                        mainAxis: 10,
                      }}
                      disabled={!swatch?.title}>
                      <button
                        key={swatch.id}
                        className="h-6 w-6 cursor-pointer rounded-sm"
                        onClick={() => onChange({ name, value: swatch.color })}
                        style={{
                          backgroundColor: swatch.color,
                        }}
                        type="button"
                      />
                    </Tooltip>
                  ))
                : DefaultSwatches.map((preset: string) => (
                    <button
                      key={preset}
                      className="h-6 w-6 cursor-pointer rounded-sm"
                      onClick={() => onChange({ name, value: preset })}
                      style={{
                        backgroundColor: preset,
                      }}
                      type="button"
                    />
                  ))}
            </div>
          </div>
        }
        disabled={isDisabled}
        isClickable>
        <div className={`h-8 w-8 rounded ${isDisabled ? "" : "cursor-pointer"}`} style={{ backgroundColor: color }} />
      </Tooltip>

      {hasInput === undefined || hasInput ? (
        <InputText
          disabled={isDisabled}
          onChange={(e) => onChange({ name, value: `#${e.target.value.replaceAll("#", "")}` })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) onEnter();
          }}
          value={color}
        />
      ) : null}
    </div>
  );
}
