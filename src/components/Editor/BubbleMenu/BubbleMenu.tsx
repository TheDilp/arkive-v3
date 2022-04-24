import {
  ChangeEvent,
  FC,
  HTMLProps,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FloatingWrapper,
  useCommands,
  useCurrentSelection,
  useHelpers,
  useSelectedText,
} from "@remirror/react";
import MenuBar from "../MenuBar";
import TextColorInput from "./TextColorInput";

export const BubbleMenu: FC = () => {
  const selection = useSelectedText();

  return (
    <FloatingWrapper
      positioner="always"
      placement="top"
      enabled={selection ? true : false}
      renderOutsideEditor
    >
      <MenuBar saving={false} />
      <TextColorInput />
    </FloatingWrapper>
  );
};
