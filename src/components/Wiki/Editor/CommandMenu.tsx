import {
  FloatingWrapper,
  useCommands,
  useMenuNavigation,
  useSuggest,
} from "@remirror/react";
import { useCallback } from "react";

export function CommandMenu() {
  const commands = useCommands();
  const { change } = useSuggest({
    char: "/",
    name: "command",
  });
  const enabled = Boolean(change);

  const range = change?.range;
  const onSubmit = useCallback(
    (cmd) => {
      console.log("Do something");
      // Remove trigger text for command menu
      commands.delete(range);
      return true;
    },
    [commands, range]
  );

  const items = ["do-something"];

  const { getMenuProps, getItemProps } = useMenuNavigation({
    items,
    isOpen: enabled,
    onSubmit,
    onDismiss: useCallback(() => true, []),
  });

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={enabled}
      placement="bottom-start"
    >
      <div {...getMenuProps()}>
        {items.map((item, index) => (
          <li key={item} {...getItemProps({ item, index })}>
            {item}
          </li>
        ))}
      </div>
    </FloatingWrapper>
  );
}
