import {
  FloatingWrapper,
  useChainedCommands,
  useCommands,
  useMenuNavigation,
  useSelectedText,
  useSuggest,
} from "@remirror/react";
import { useCallback } from "react";

export function CommandMenu() {
  const chain = useChainedCommands();
  const { change } = useSuggest({
    char: "/",
    name: "command",
  });

  const enabled = Boolean(change?.match[1]);
  console.log(enabled);
  const range = change?.range;
  const onSubmit = useCallback(
    (cmd) => {
      if (cmd.type === "heading") {
        chain.toggleHeading({ level: cmd.level }).delete(range).run();
      }
      // Remove trigger text for command menu
      return true;
    },
    [chain, range]
  );

  const items = [
    { name: "H1", type: "heading", level: 1 },
    { name: "H2", type: "heading", level: 2 },
    { name: "H3", type: "heading", level: 3 },
    { name: "H4", type: "heading", level: 4 },
    { name: "H5", type: "heading", level: 5 },
    { name: "H6", type: "heading", level: 6 },
  ];

  const { getMenuProps, getItemProps, indexIsSelected } = useMenuNavigation({
    items,
    isOpen: enabled,
    onSubmit,
    direction: "vertical",
    onDismiss: useCallback(() => true, []),
  });

  return (
    <FloatingWrapper
      positioner="always"
      enabled={enabled}
      placement="auto"
      renderOutsideEditor
    >
      <ul
        className={`${
          !enabled ? "hidden" : ""
        } remirror-mention-atom-popup-wrapper z-5`}
        {...getMenuProps()}
      >
        {items.map((item, index) => {
          return (
            <li
              className={`remirror-mention-atom-popup-item ${
                indexIsSelected(index)
                  ? "remirror-mention-atom-popup-highlight"
                  : ""
              }`}
              key={item.name}
              {...getItemProps({ item, index })}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </FloatingWrapper>
  );
}
