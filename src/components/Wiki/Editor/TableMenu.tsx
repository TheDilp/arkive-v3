import {
  ComponentItem,
  FloatingToolbar,
  FloatingWrapper,
  ToolbarItemUnion,
  useActive,
  useCommands,
} from "@remirror/react";
import { useMemo } from "react";
import { createMarkPositioner } from "remirror/extensions";

export const TableMenu = () => {
  const commands = useCommands();
  const active = useActive();
  // A positioner which only shows for links.
  const linkPositioner = useMemo(
    () => createMarkPositioner({ type: "table" }),
    []
  );
  const linkEditItems: ToolbarItemUnion[] = useMemo(
    () => [
      {
        type: ComponentItem.ToolbarGroup,
        label: "Link",
        items: true
          ? [
              {
                type: ComponentItem.ToolbarButton,
                onClick: () => {
                  // clickEdit()
                },
                icon: "pencilLine",
              },
              {
                type: ComponentItem.ToolbarButton,
                onClick: () => {
                  // clickEdit()
                },
                icon: "linkUnlink",
              },
            ]
          : [
              {
                type: ComponentItem.ToolbarButton,
                onClick: () => () => {
                  // clickEdit()
                },
                icon: "link",
              },
            ],
      },
    ],
    []
    // [clickEdit, onRemove, activeLink]
  );
  return (
    <FloatingToolbar
      items={linkEditItems}
      positioner={linkPositioner}
      placement="bottom"
      enabled={true}
    />
    // <FloatingWrapper positioner="cursor" placement="top">
    //   <button
    //     onMouseDown={(event) => event.preventDefault()}
    //     onClick={() => commands.toggleBold()}
    //     style={{ fontWeight: active.bold() ? "bold" : undefined }}
    //     data-testid="bubble-menu-bold"
    //   >
    //     Bold
    //   </button>
    //   <button
    //     onMouseDown={(event) => event.preventDefault()}
    //     onClick={() => commands.toggleItalic()}
    //     style={{ fontWeight: active.italic() ? "bold" : undefined }}
    //   >
    //     Italic
    //   </button>
    //   <button
    //     onMouseDown={(event) => event.preventDefault()}
    //     onClick={() => commands.toggleUnderline()}
    //     style={{ fontWeight: active.underline() ? "bold" : undefined }}
    //   >
    //     Underline
    //   </button>
    // </FloatingWrapper>
  );
};
