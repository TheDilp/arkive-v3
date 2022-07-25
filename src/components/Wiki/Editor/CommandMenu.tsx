import { Icon } from "@iconify/react";
import {
  FloatingWrapper,
  useChainedCommands,
  useMenuNavigation,
  useSuggest,
} from "@remirror/react";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { ReplaceTextProps } from "remirror";
import { slashMenuItem } from "../../../custom-types";
import { BoardProps } from "../../../types/BoardTypes";
import { MapProps } from "../../../types/MapTypes";
import { defaultSlashItems, toastError } from "../../../utils/utils";

export function CommandMenu() {
  const chain = useChainedCommands();
  const [itemsType, setItemsType] = useState<"commands" | "maps" | "boards">(
    "commands"
  );
  const { change, exit } = useSuggest({
    char: "/",
    name: "command",
  });
  const enabled = Boolean(change);
  const range = change?.range;
  const [items, setItems] = useState<slashMenuItem[]>(defaultSlashItems);
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const maps = queryClient.getQueryData<MapProps[]>(`${project_id}-maps`);
  const boards = queryClient.getQueryData<BoardProps[]>(`${project_id}-boards`);
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
      } else if (cmd.type === "map_select") {
        setItemsType("maps");
        setItems(
          maps
            ?.filter((map) => !map.folder)
            .map((map) => ({
              name: map.title,
              type: "map",
              icon: "mdi:map",
              map_id: map.id,
            })) || defaultSlashItems
        );
      } else if (cmd.type === "map") {
        if (cmd.map_id) {
          chain
            .delete(range)
            .insertMapPreview({
              id: cmd.map_id,
              type: "map",
            })
            .run();
          setItemsType("commands");
        } else {
          toastError("Looks like the map's id is missing.");
        }
      } else if (cmd.type === "board_select") {
        setItemsType("boards");
        setItems(
          boards
            ?.filter((board) => !board.folder)
            .map((board) => ({
              name: board.title,
              type: "board",
              icon: "mdi:draw",
              board_id: board.id,
            })) || defaultSlashItems
        );
      } else if (cmd.type === "board") {
        if (cmd.board_id) {
          chain
            .delete(range)
            .insertMapPreview({
              id: cmd.board_id,
              type: "board",
            })
            .run();
          setItemsType("commands");
        } else {
          toastError("Looks like the map's id is missing.");
        }
      }
      // Remove trigger text for command menu
      return true;
    },
    [chain, range]
  );

  const { getMenuProps, getItemProps, indexIsSelected, setIndex } =
    useMenuNavigation({
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
    }
  }, [exit]);

  useEffect(() => {
    if (change?.query.full) {
      if (itemsType === "commands") {
        setItems(
          defaultSlashItems.filter((item) =>
            item.name.toLowerCase().startsWith(change.query.full)
          )
        );
      } else if (itemsType === "maps") {
        setItems(
          maps
            ?.filter(
              (map) =>
                !map.folder &&
                map.title
                  .toLowerCase()
                  .includes(change.query.full.replace("map", "").toLowerCase())
            )
            .map((map) => ({
              name: map.title,
              type: "map",
              icon: "mdi:map",
              map_id: map.id,
            })) || defaultSlashItems
        );
      } else if (itemsType === "boards") {
        setItems(
          boards
            ?.filter(
              (board) =>
                !board.folder &&
                board.title
                  .toLowerCase()
                  .includes(
                    change.query.full.replace("board", "").toLowerCase()
                  )
            )
            .map((board) => ({
              name: board.title,
              type: "board",
              icon: "mdi:draw",
              board_id: board.id,
            })) || defaultSlashItems
        );
      }
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
