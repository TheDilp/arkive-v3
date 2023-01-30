import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { baseURLS } from "../../../types/CRUDenums";
import { MentionContextAtom } from "../../../utils/Atoms/atoms";
import { FetchFunction } from "../../../utils/CRUD/CRUDFetch";

export default function DrawerInsertWord() {
  const { project_id } = useParams();
  const [query, setQuery] = useState("");
  const [mention] = useAtom(MentionContextAtom);
  const {
    data: items,
    refetch,
    isFetching,
  } = useQuery<
    { id: string; dictionary: { title: string }; title: string; translation?: string }[],
    unknown,
    { id: string; label: string; searchItem?: string; displayLabel?: string; language?: string }[]
  >(
    ["words", project_id],
    async () => {
      if (query)
        return FetchFunction({
          url: `${baseURLS.baseServer}search`,
          method: "POST",
          body: JSON.stringify({
            project_id,
            query,
            type: "words",
          }),
        });
      return [];
    },
    {
      enabled: false,
      select: (res) => {
        return res.map((item) => {
          if (item?.translation)
            return {
              id: item.id,
              searchItem: item.translation,
              language: item.dictionary.title,
              label: item.title,
              displayLabel: `${item.title} (${item.translation})`,
            };
          return { id: item.id, label: item.title };
        });
      },
    },
  );
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) {
        refetch();
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-center font-Lato text-2xl">Add word for dictionary</h2>
      <span className="p-input-icon-right w-full">
        {isFetching ? <i className="pi pi-spin pi-spinner" /> : null}
        <InputText
          className="w-full dark:bg-blue-600"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for words"
          value={query}
        />
      </span>
      <div>
        <ul className="mt-2 flex flex-col border-zinc-800 px-1 font-Lato odd:border-y">
          {items?.map((item) => (
            <li key={item.id} className="border-zinc-700 py-1 font-Lato even:border-y">
              <button
                className="flex w-full cursor-pointer items-center justify-between hover:text-sky-400"
                onClick={() => {
                  mention.data.commands.createMentionAtom({ name: "words" }, { id: item.id, label: item.label });
                }}
                type="button">
                <span className="font-semibold">{item.label} </span>
                <span className="text-sm font-light italic">
                  ({item?.language || null}: {item?.searchItem})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
