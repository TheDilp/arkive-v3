import { FloatingWrapper, useMentionAtom } from "@remirror/react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { baseURLS } from "../../types/CRUDenums";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";

export default function MentionDropdownComponent() {
  const { project_id } = useParams();
  const [options, setOptions] = useState<{ id: string; label: string; displayLabel?: string }[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } = useMentionAtom({
    items: options,
  });

  const search = useDebouncedCallback(async () => {
    setIsFetching(true);
    const items = await FetchFunction({
      url: `${baseURLS.baseServer}search`,
      method: "POST",
      body: JSON.stringify({
        project_id,
        query: state?.query?.full,
        type: state?.name,
        take: 5,
      }),
    });
    setIsFetching(false);
    setOptions(
      items
        .sort()
        .map((item: any) => {
          if (item?.translation)
            return {
              id: item.id,
              searchItem: item.translation,
              label: item.title,
              displayLabel: `${item.title} (${item.translation})`,
            };
          return { id: item.id, label: item.title };
        })
        .slice(0, 5),
    );
  }, 500);

  useEffect(() => {
    if (state && state?.query?.full?.length > 1) {
      search();
    } else {
      setOptions([]);
    }
  }, [state?.query?.full]);

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
          ? (options || []).map((item, index) => {
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
