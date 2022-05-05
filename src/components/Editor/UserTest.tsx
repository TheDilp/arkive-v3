import {
  FloatingWrapper,
  MentionAtomNodeAttributes,
  useCommands,
  useHelpers,
  useMentionAtom,
} from "@remirror/react";
import { cx } from "remirror";
import { useEffect, useState } from "react";

export default function UserTest() {
  const ALL_USERS = [
    { id: "joe", label: "Joe" },
    { id: "sue", label: "Sue" },
    { id: "pat", label: "Pat" },
    { id: "tom", label: "Tom" },
    { id: "jim", label: "Jim" },
  ];

  const [users, setUsers] = useState<MentionAtomNodeAttributes[]>([]);
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMentionAtom({
      items: users,
    });
  const { createMentionAtom } = useCommands();
  useEffect(() => {
    if (!state) {
      return;
    }

    const searchTerm = state.query.full.toLowerCase();
    const filteredUsers = ALL_USERS.filter((user) =>
      user.label.toLowerCase().includes(searchTerm)
    )
      .sort()
      .slice(0, 5);
    setUsers(filteredUsers);
  }, [state]);

  const enabled = !!state;
  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={enabled}
      placement="bottom-start"
    >
      <div {...getMenuProps()} className="suggestions">
        {enabled &&
          users.map((user, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                onClick={() =>
                  createMentionAtom(
                    { name: "at" },
                    {
                      id: "test",
                      label: user.label,
                      name: "at",
                    }
                  )
                }
                key={user.id}
                className={cx(
                  "suggestion",
                  isHighlighted && "bg-green-500",
                  isHovered && "hovered"
                )}
              >
                {user.label}
              </div>
            );
          })}
      </div>
    </FloatingWrapper>
  );
}
