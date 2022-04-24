import { FC } from "react";
import {
  FloatingWrapper,
  useCurrentSelection,
  useHelpers,
  useSelectedText,
} from "@remirror/react";
import MenuBar from "../MenuBar";

export const BubbleMenu: FC = () => {
  const selection = useSelectedText();
  console.log(selection);
  return (
    <FloatingWrapper
      positioner="always"
      placement="top"
      enabled={selection ? true : false}
      renderOutsideEditor
    >
      <MenuBar saving={false} />
    </FloatingWrapper>
  );
};
