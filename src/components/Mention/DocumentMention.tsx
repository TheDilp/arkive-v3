import { useQuery } from "@tanstack/react-query";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

import Editor from "../../pages/Editor/Editor";
import { getSingleURL } from "../../utils/CRUD/CRUDUrls";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  title: string;
  id: string | undefined;
  label: string;
  isDisabledTooltip?: boolean;
};

function TooltipContent({ title, id }: Pick<Props, "title" | "id">) {
  const { data, isLoading } = useQuery({
    queryKey: [id as string, "documents"],
    queryFn: async () => {
      const url = getSingleURL("documents", id as string);
      if (url) {
        const res = await fetch(url, {
          method: "GET",
        });
        const resData = await res.json();
        return resData;
      }

      return null;
    },

    staleTime: 5 * 60 * 1000,
  });
  return (
    <Card className="h-96 w-96 overflow-y-auto" title={<div className="p-0 text-center">{title}</div>}>
      <div className="whitespace-pre-line">
        {isLoading ? <ProgressSpinner /> : null}
        {data?.content && !isLoading ? <Editor content={data.content} editable={false} /> : "This document has no content."}
      </div>
    </Card>
  );
}
export default function DocumentMention({ title, id, label, isDisabledTooltip }: Props) {
  return (
    <Tooltip disabled={isDisabledTooltip ?? false} label={<TooltipContent id={id} title={title} />}>
      <Link className="font-Lato text-base font-bold text-white" to={`../doc/${id}`}>
        {title || label}
      </Link>
    </Tooltip>
  );
}
