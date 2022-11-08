import React from "react";
import { useParams } from "react-router-dom";
import { useGetItem } from "../../hooks/getItemHook";

type Props = {};

export default function Editor({}: Props) {
  const { project_id, item_id } = useParams();
  const document = useGetItem(
    project_id as string,
    item_id as string,
    "documents"
  );
  console.log(document);
  //   if (!document) return null;
  return <div>{document?.title}</div>;
}
