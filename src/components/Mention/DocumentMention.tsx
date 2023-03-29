import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { DocumentType } from "../../types/ItemTypes/documentTypes";
import { OtherContextMenuAtom } from "../../utils/Atoms/atoms";
import { FetchFunction } from "../../utils/CRUD/CRUDFetch";
import { getSingleURL } from "../../utils/CRUD/CRUDUrls";
import StaticRender from "../Editor/StaticRender";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  alterId: string | null;
  id: string | undefined;
  label: string;
  isDisabledTooltip?: boolean;
  project_id: string | undefined;
  title?: string;
};

export function DocumentMentionTooltip({ title, id }: Pick<Props, "id" | "title">) {
  const { data, isLoading } = useQuery({
    queryKey: ["documents", id],
    queryFn: async () => {
      const url = getSingleURL("documents");
      if (url) {
        return FetchFunction({ url, method: "POST", body: JSON.stringify({ id }) });
      }

      return null;
    },
    staleTime: 5 * 60 * 1000,
  });
  return (
    <Card className="h-96 w-96 overflow-y-auto" title={<div className="p-0 text-center">{title || data?.title}</div>}>
      <div className="whitespace-pre-line">
        {isLoading ? <ProgressSpinner /> : null}
        {data?.content && !isLoading ? <StaticRender content={data.content} /> : null}
      </div>
    </Card>
  );
}
export default function DocumentMention({ alterId, title, id, label, isDisabledTooltip, project_id }: Props) {
  const queryClient = useQueryClient();
  const allDocuments = queryClient.getQueryData<DocumentType[]>(["allItems", project_id, "documents"]);

  const { data: documents } = useGetAllItems<DocumentType>(project_id as string, "documents", {
    enabled: !allDocuments,
    staleTime: 5 * 60 * 1000,
  });
  const doc = (allDocuments || documents)?.find((d) => d?.id === id);
  const finalName = alterId ? doc?.alter_names?.find((a) => a?.id === alterId)?.title : doc?.title || title || label;
  const [mention, setMention] = useAtom(OtherContextMenuAtom);
  return (
    <Tooltip content={<DocumentMentionTooltip id={id} title={title || label} />} disabled={isDisabledTooltip ?? false}>
      <Link
        className="font-Lato text-sm font-bold text-white underline hover:text-sky-400"
        onContextMenu={(e) => {
          if (id) {
            setMention((prev) => ({ ...prev, data: { id } }));
            mention.cm.current.show(e);
          }
        }}
        to={!project_id ? `/view/documents/${id}` : `/project/${project_id}/documents/${id}`}>
        {finalName || title || label}
      </Link>
    </Tooltip>
  );
}
