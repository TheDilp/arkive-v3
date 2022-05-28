import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getSingleDocument } from "../../../utils/supabaseUtils";
import LiveHoverWindow from "../../Editor/LinkHover/LinkHoverWindow";
type Props = {};

export default function PublicWiki({}: Props) {
  const { doc_id } = useParams();

  const { data, isLoading } = useQuery(
    doc_id as string,
    async () => {
      return await getSingleDocument(doc_id as string);
    },
    {
      staleTime: Infinity,
    }
  );

  return (
    <div>
      <LiveHoverWindow content={data?.content || null} />
    </div>
  );
}
