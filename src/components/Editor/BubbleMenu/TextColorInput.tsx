import { useCommands, useHelpers } from "@remirror/react";
import { ChangeEvent, HTMLProps, useEffect, useRef, useState } from "react";
type Props = {};

export default function TextColorInput({}: Props) {
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
        }}
        value={color}
      />
    );
  };

  return (
    <DelayAutoFocusInput
      // style={{ zIndex: 20 }}
      //   autoFocus
      placeholder="Enter link..."
      //   onChange={(event: ChangeEvent<HTMLInputElement>) => {
      //     setColor(event.target.value);
      //   }}

      value={color}
    />
  );
}
