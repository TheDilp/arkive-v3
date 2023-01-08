import { useQuery } from "@tanstack/react-query";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

import { getSingleURL } from "../../utils/CRUD/CRUDUrls";
import StaticRender from "../Editor/StaticRender";
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
  });
  return (
    <Card className="h-96 w-96 overflow-y-auto" title={<div className="p-0 text-center">{title}</div>}>
      <div className="whitespace-pre-line">
        {isLoading ? <ProgressSpinner /> : null}
        {data?.content && !isLoading ? <StaticRender content={data.content} /> : null}
      </div>
    </Card>
  );
}
export default function DocumentMention({ title, id, label, isDisabledTooltip }: Props) {
  return (
    <Tooltip disabled={isDisabledTooltip ?? false} content={<TooltipContent id={id} title={title || label} />}>
      <Link className="font-Lato text-sm font-bold text-white underline hover:text-sky-400" to={`../${id}`}>
        {title || label}
      </Link>
    </Tooltip>
  );
}
