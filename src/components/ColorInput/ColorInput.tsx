/* eslint-disable jsx-a11y/control-has-associated-label */
import { useAtom } from "jotai";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
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
  isShowingSwatches?: boolean;
  onChange: ({ name, value }: { name: string; value: string }) => void;
  onEnter?: () => void;
};

export default function ColorInput({ name, color, isDisabled, isShowingSwatches = true, onChange, hasInput, onEnter }: Props) {
  const [filter, setFilter] = useState("");
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
            {isShowingSwatches ? (
              <>
                <InputText
                  className="p-inputtext-sm w-full"
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search swatch"
                  value={filter}
                />
                <div
                  className="grid h-24 content-start gap-x-2 gap-y-1 overflow-y-auto bg-zinc-900 p-1"
                  style={{
                    gridTemplateColumns: "repeat(6, minmax(1.5rem, 1fr))",
                  }}>
                  {projectData?.swatches?.length
                    ? projectData.swatches
                        .filter((swatch) => (filter ? swatch?.title?.toLowerCase()?.includes(filter.toLowerCase()) : true))
                        .map((swatch) => (
                          <Tooltip
                            key={swatch.id}
                            content={swatch?.title ? <DefaultTooltip>{swatch.title}</DefaultTooltip> : null}
                            customOffset={{
                              mainAxis: 10,
                            }}
                            disabled={!swatch?.title}>
                            <button
                              className="h-6 w-6 cursor-pointer rounded-sm"
                              onClick={() => {
                                onChange({ name, value: swatch.color });
                                setFilter("");
                              }}
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
              </>
            ) : null}
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
