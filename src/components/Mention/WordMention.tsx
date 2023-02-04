import { useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

import { baseURLS } from "../../types/CRUDenums";
import { WordType } from "../../types/ItemTypes/dictionaryTypes";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  title: string;
  id: string | undefined;
  label: string;
  isReadOnly?: boolean;
  isDisabledTooltip?: boolean;
};

export function WordMentionTooltip({ id, isReadOnly }: Pick<Props, "id" | "isReadOnly">) {
  const { data, isLoading } = useQuery<WordType>({
    queryKey: ["words", id],
    queryFn: async () => {
      return FetchFunction({
        url: `${baseURLS.baseServer}${isReadOnly ? "getpublicword" : "getsingleword"}`,
        method: "POST",
        body: JSON.stringify({ id }),
      });
    },
    staleTime: 5 * 60 * 1000,
  });
  return (
    <span className="block h-fit w-fit max-w-[20rem] rounded border border-zinc-800 bg-black p-2 shadow">
      <span className="whitespace-pre-line font-Lato font-light">
        {isLoading ? (
          <span className="h-4 w-4">
            <ProgressSpinner className="max-h-full max-w-full" is="span" />
          </span>
        ) : null}
        <span className="italic">{data?.dictionary?.title ? `(${data?.dictionary?.title}: ${data?.translation}) ` : null}</span>
        {data?.description && !isLoading ? data.description : null}
      </span>
    </span>
  );
}
export default function WordMention({ title, id, isReadOnly, label, isDisabledTooltip }: Props) {
  return (
    <Tooltip content={<WordMentionTooltip id={id} isReadOnly={isReadOnly} />} disabled={isDisabledTooltip ?? false}>
      <span className="cursor-pointer font-light italic">
        {title || label}
        <sup>*</sup>
      </span>
    </Tooltip>
  );
}
