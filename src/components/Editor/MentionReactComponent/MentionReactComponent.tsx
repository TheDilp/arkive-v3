import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { BoardProps, DocumentProps, MapProps } from "../../../custom-types";
import { Tooltip } from "primereact/tooltip";
import { Card } from "primereact/card";
import RemirrorContext from "../RemirrorContext";
import LinkHoverWindow from "../LinkHover/LinkHoverWindow";
import { HoverTooltip } from "../LinkHover/HoverTooltip";
import DocumentMention from "./DocumentMention";
import MapMention from "./MapMention";
import BoardMention from "./BoardMention";
type Props = {
  node: any;
};

export default function MentionReactComponent({ node }: Props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { project_id } = useParams();
  const docs: DocumentProps[] | undefined = queryClient.getQueryData(
    `${project_id}-documents`
  );
  const maps: MapProps[] | undefined = queryClient.getQueryData<MapProps[]>(
    `${project_id}-maps`
  );
  const boards: BoardProps[] | undefined = queryClient.getQueryData<
    BoardProps[]
  >(`${project_id}-boards`);
  let docItem: DocumentProps | undefined;
  let mapItem: MapProps | undefined;
  let boardItem: BoardProps | undefined;

  if (node.attrs.name === "at") {
    docItem = docs ? docs.find((doc) => doc.id === node.attrs.id) : undefined;
  } else if (node.attrs.name === "hash") {
    mapItem = maps ? maps.find((map) => map.id === node.attrs.id) : undefined;
  } else {
    boardItem = boards
      ? boards.find((board) => board.id === node.attrs.id)
      : undefined;
  }
  let { id: nodeId, name: nodeName, label: nodeLabel } = node.attrs;

  if (nodeName === "at" && docItem) {
    return (
      <DocumentMention
        title={docItem.title}
        content={docItem.content}
        nodeId={nodeId}
        nodeLabel={nodeLabel}
      />
    );
  } else if (nodeName === "hash" && mapItem) {
    return (
      <MapMention title={mapItem.title} nodeId={nodeId} nodeLabel={nodeLabel} />
    );
  } else if (nodeName === "dollah" && boardItem) {
    return (
      <BoardMention
        title={boardItem.title}
        nodeId={nodeId}
        nodeLabel={nodeLabel}
      />
    );
  } else {
    return null;
  }
}
