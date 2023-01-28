import { FloatingWrapper, useMentionAtom } from "@remirror/react";
import { useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { baseURLS } from "../../types/CRUDenums";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";

export default function MentionDropdownComponent() {
  const { project_id } = useParams();
  const [options, setOptions] = useState<{ id: string; label: string; displayLabel?: string }[]>([]);

  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } = useMentionAtom({
    items: options,
  });

  const enabled = Boolean(!!state?.name && state?.query?.full?.length && state.query.full.length > 0);

  const { data: items, isFetching } = useQuery<
    { id: string; title: string; translation?: string }[],
    unknown,
    { id: string; label: string; displayLabel?: string }[]
  >(
    ["mentionItems", project_id, state?.name],
    async () => {
      if (state)
        return FetchFunction({
          url: `${baseURLS.baseServer}search`,
          method: "POST",
          body: JSON.stringify({
            project_id,
            query: state?.query?.full,
            type: state?.name,
          }),
        });
      return [];
    },
    {
      enabled,
      select: (res) => {
        return res.map((item) => {
          if (item?.translation) return { id: item.id, label: item.title, displayLabel: `${item.title} (${item.translation})` };
          return { id: item.id, label: item.title };
        });
      },
      onSuccess: (data) => {
        setOptions(data);
      },
    },
  );

  useEffect(() => {
    if (!state) {
      return;
    }

    const searchTerm = state.query.full.toLowerCase();

    const filteredOptions = (items || [])
      .filter((item) => item.label.toLowerCase().includes(searchTerm))
      .sort()
      .slice(0, 5);

    setOptions(filteredOptions);
  }, [state]);

  return (
    <FloatingWrapper
      containerClass="commandMenu"
      enabled={Boolean(state)}
      placement="auto-end"
      positioner="always"
      renderOutsideEditor>
      <ul
        className="remirror-mention-atom-popup-wrapper z-50 max-h-60 w-[12rem] min-w-[12rem] overflow-y-auto p-0"
        {...getMenuProps()}>
        {isFetching ? <ProgressSpinner /> : null}
        {!isFetching
          ? (items || []).map((item, index) => {
              return (
                <li
                  key={item.id}
                  className={`remirror-mention-atom-popup-item flex w-[12rem] items-center justify-between ${
                    indexIsSelected(index) ? "remirror-mention-atom-popup-highlight" : ""
                  } ${indexIsHovered(index) ? "remirror-mention-atom-popup-highlight" : ""}`}
                  {...getItemProps({ item, index })}>
                  {item?.displayLabel || item.label}
                </li>
              );
            })
          : null}
      </ul>
    </FloatingWrapper>
  );
}
