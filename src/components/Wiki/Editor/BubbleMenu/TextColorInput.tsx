import { useCommands } from "@remirror/react";
import { HTMLProps, useRef, useState } from "react";
type Props = {
  colorInput: boolean;
  setColorInput: (colorInput: boolean) => void;
};

export default function TextColorInput({ colorInput, setColorInput }: Props) {
  const { setTextColor } = useCommands();

  function useColor() {
    const [color, setColor] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    return { color, setColor, isEditing, setIsEditing };
  }
  const { color } = useColor();
  const DelayAutoFocusInput = ({
    autoFocus,
    ...rest
  }: HTMLProps<HTMLInputElement>) => {
    const { color, setColor } = useColor();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <input
        ref={inputRef}
        {...rest}
        type="color"
        onChange={(e) => {
          setColor(e.target.value);
        }}
        onBlur={(e) => {
          setTextColor(e.target.value);
          setColorInput(false);
        }}
        value={color}
      />
    );
  };

  return (
    <DelayAutoFocusInput
      placeholder="Enter color..."
      value={color}
      style={{
        zIndex: 999999999,
        top: "50px",
        float: "right",
        display: !colorInput ? "none" : "",
        position: "relative",
      }}
    />
  );
}
