import { Icon } from "@iconify/react";
import { FloatingWrapper, useChainedCommands, useMenuNavigation, useSuggest } from "@remirror/react";
import { useCallback, useEffect, useState } from "react";

import { slashMenuItem } from "../../types/generalTypes";
import { defaultSlashItems } from "../../utils/editorUtils";

export function CommandMenu() {
  const chain = useChainedCommands();
  const [itemsType, setItemsType] = useState<"commands" | "columns" | "maps" | "boards">("commands");
  const { change, exit } = useSuggest({
    char: "/",
    name: "command",
  });
  const enabled = Boolean(change);
  const range = change?.range;
  const [items, setItems] = useState<slashMenuItem[]>(defaultSlashItems);
  const onSubmit = useCallback(
    (cmd: slashMenuItem) => {
      if (cmd.type === "heading") {
        chain.toggleHeading({ level: cmd.level }).delete(range).run();
      } else if (cmd.type === "list") {
        if (cmd.name === "Bullet List") {
          chain.delete(range).toggleBulletList().run();
        } else if (cmd.name === "Ordered List") {
          chain.delete(range).toggleOrderedList().run();
        } else if (cmd.name === "Task List") {
          chain.delete(range).toggleTaskList().run();
        }
      } else if (cmd.type === "quote") {
        chain.delete(range).toggleBlockquote().run();
      } else if (cmd.type === "callout") {
        chain.delete(range).toggleCallout({ type: cmd.callout_type }).run();
      } else if (cmd.type === "secret") {
        chain.delete(range).toggleSecret().run();
      } else if (cmd.type === "image") {
        // chain.delete(range).toggleSecret().run();
      } else if (cmd.type === "divider") {
        chain.delete(range).insertHorizontalRule().run();
      }
      // Remove trigger text for command menu
      return true;
    },
    [chain, range],
  );

  const { getMenuProps, getItemProps, indexIsSelected, setIndex } = useMenuNavigation({
    items,
    isOpen: enabled,
    onSubmit,
    direction: "vertical",
    onDismiss: useCallback(() => {
      chain.delete(range).run();
      setItemsType("commands");
      return true;
    }, []),
  });

  useEffect(() => {
    if (exit) {
      setIndex(0);
      setItemsType("commands");
    }
  }, [exit]);

  useEffect(() => {
    if (change?.query?.full) {
      if (itemsType === "commands") {
        setItems(defaultSlashItems.filter((item) => item.name.toLowerCase().startsWith(change.query.full.toLowerCase())));
      }
    } else {
      setItems(defaultSlashItems);
    }
  }, [change?.query?.full]);

  return (
    <FloatingWrapper containerClass="commandMenu" enabled={enabled} placement="auto" positioner="always" renderOutsideEditor>
      <ul className="remirror-mention-atom-popup-wrapper z-50 h-[15rem] overflow-y-auto p-0" {...getMenuProps()}>
        {items.map((item, index) => {
          return (
            <li
              key={item.name}
              className={`remirror-mention-atom-popup-item flex w-[12rem] items-center justify-between ${
                indexIsSelected(index) ? "remirror-mention-atom-popup-highlight" : ""
              }`}
              {...getItemProps({ item, index })}>
              <Icon color={item.color} fontSize={32} icon={item.icon} />
              {item.name}
            </li>
          );
        })}
      </ul>
    </FloatingWrapper>
  );
}
