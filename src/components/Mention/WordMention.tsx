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
  isDisabledTooltip?: boolean;
};

export function WordMentionTooltip({ id }: Pick<Props, "id">) {
  const { data, isLoading } = useQuery<WordType>({
    queryKey: ["words", id],
    queryFn: async () => {
      return FetchFunction({ url: `${baseURLS.baseServer}getsingleword`, method: "POST", body: JSON.stringify({ id }) });
    },
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className="h-fit w-fit max-w-[20rem] rounded bg-black p-2">
      <div className="whitespace-pre-line font-Lato font-light">
        {isLoading ? <ProgressSpinner /> : null}
        <span className="italic">{data?.dictionary?.title ? `(${data?.dictionary?.title}: ${data?.translation}) ` : null}</span>
        {data?.description && !isLoading ? data.description : null}
      </div>
    </div>
  );
}
export default function WordMention({ title, id, label, isDisabledTooltip }: Props) {
  return (
    <Tooltip content={<WordMentionTooltip id={id} />} disabled={isDisabledTooltip ?? false}>
      <span className="cursor-pointer font-light italic">
        {title || label}
        <sup>*</sup>
      </span>
    </Tooltip>
  );
}
