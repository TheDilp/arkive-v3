import { FloatingWrapper, useSelectedText } from "@remirror/react";
import { FC } from "react";
import MenuBar from "../MenuBar";

export const BubbleMenu: FC = () => {
  const selection = useSelectedText();

  return (
    <FloatingWrapper
      positioner="always"
      placement="auto"
      enabled={selection ? true : false}
      renderOutsideEditor
    >
      <MenuBar saving={false} />
    </FloatingWrapper>
  );
};
