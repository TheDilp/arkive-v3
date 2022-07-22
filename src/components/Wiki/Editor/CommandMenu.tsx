import { Icon } from "@iconify/react";
import {
  FloatingWrapper,
  useChainedCommands,
  useMenuNavigation,
  useSuggest,
} from "@remirror/react";
import { useCallback, useEffect, useState } from "react";
import { slashMenuItem } from "../../../custom-types";
import { defaultSlashItems } from "../../../utils/utils";

export function CommandMenu() {
  const chain = useChainedCommands();
  const { change, exit } = useSuggest({
    char: "/",
    name: "command",
  });
  const enabled = Boolean(change);
  const range = change?.range;
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
        chain.delete(range).toggleSecret().run();
      } else if (cmd.type === "divider") {
        chain.delete(range).insertHorizontalRule().run();
      } else if (cmd.type === "map") {
        chain
          .delete(range)
          .insertMapPreview({
            id: "598c4659-fa48-41a6-ba31-83327ee07101",
          })
          .run();
      }
      // Remove trigger text for command menu
      return true;
    },
    [chain, range]
  );

  const [items, setItems] = useState<slashMenuItem[]>(defaultSlashItems);

  const { getMenuProps, getItemProps, indexIsSelected, setIndex } =
    useMenuNavigation({
      items,
      isOpen: enabled,
      onSubmit,
      direction: "vertical",
      onDismiss: useCallback(() => {
        chain.delete(range).run();
        return true;
      }, []),
    });

  useEffect(() => {
    if (exit) {
      setIndex(0);
    }
  }, [exit]);

  useEffect(() => {
    if (change?.query.full) {
      setItems(
        defaultSlashItems.filter((item) =>
          item.name.toLowerCase().startsWith(change.query.full)
        )
      );
    } else {
      setItems(defaultSlashItems);
    }
  }, [change?.query.full]);

  return (
    <FloatingWrapper
      positioner="always"
      enabled={enabled}
      placement="auto"
      renderOutsideEditor
      containerClass="commandMenu"
    >
      <ul
        className="remirror-mention-atom-popup-wrapper z-5 p-0 overflow-y-auto h-15rem"
        {...getMenuProps()}
      >
        {items.map((item, index) => {
          return (
            <li
              className={`remirror-mention-atom-popup-item w-12rem flex justify-content-between align-items-center ${
                indexIsSelected(index)
                  ? "remirror-mention-atom-popup-highlight"
                  : ""
              }`}
              key={item.name}
              {...getItemProps({ item, index })}
            >
              <Icon icon={item.icon} fontSize={32} color={item.color} />
              {item.name}
            </li>
          );
        })}
      </ul>
    </FloatingWrapper>
  );
}
