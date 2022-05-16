import { FloatingWrapper, useSelectedText } from "@remirror/react";
import { FC, useState } from "react";
import BubbleMenuBar from "./BubbleMenuBar";
import TextColorInput from "./TextColorInput";

export const BubbleMenu: FC = () => {
  const [colorInput, setColorInput] = useState(false);
  const selection = useSelectedText();

  return (
    <FloatingWrapper
      positioner="always"
      placement="bottom"
      enabled={selection ? true : false}
      renderOutsideEditor
    >
      <BubbleMenuBar saving={false} setColorInput={setColorInput} />
      <TextColorInput colorInput={colorInput} setColorInput={setColorInput} />
    </FloatingWrapper>
  );
};
