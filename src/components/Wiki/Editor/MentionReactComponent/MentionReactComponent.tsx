import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { DocumentProps } from "../../../../custom-types";
import { BoardProps } from "../../../../types/BoardTypes";
import { MapProps } from "../../../../types/MapTypes";
import BoardMention from "./BoardMention";
import DocumentMention from "./DocumentMention";
import MapMention from "./MapMention";
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
  let { id: nodeId, name: nodeName, label: nodeLabel } = node.attrs;

  if (nodeName === "at") {
    docItem = docs
      ? docs.find((doc) => doc.id === nodeId.replace(/^alter-\d /g, ""))
      : undefined;
  } else if (nodeName === "hash") {
    mapItem = maps ? maps.find((map) => map.id === nodeId) : undefined;
  } else {
    boardItem = boards
      ? boards.find((board) => board.id === nodeId)
      : undefined;
  }
  if (nodeName === "at") {
    if (docItem) {
      let title = "";
      let id: string = nodeId;

      //Detect if it's an alter_name by checking the id
      //Extract the main documents ID from the node's id if it is
      if (id.startsWith("alter")) {
        id = nodeId.replace(/^alter-\d /g, "");
      }
      // If the item is using an alter name then use it instead of the main document's title
      if (docItem.alter_names && docItem.alter_names.includes(nodeLabel)) {
        title = nodeLabel;
      }
      // Otherwise fallback to the doc title
      else {
        title = docItem.title;
      }
      return (
        <DocumentMention
          title={title}
          content={docItem.content}
          nodeId={id}
          nodeLabel={nodeLabel}
        />
      );
    } else {
      return (
        <DocumentMention
          title={nodeLabel}
          content={null}
          nodeId={undefined}
          nodeLabel={nodeLabel}
        />
      );
    }
  } else if (nodeName === "hash") {
    if (mapItem) {
      return (
        <MapMention
          title={mapItem.title}
          nodeId={nodeId}
          nodeLabel={nodeLabel}
        />
      );
    } else {
      return <MapMention nodeId={undefined} nodeLabel={nodeLabel} />;
    }
  } else if (nodeName === "dollah") {
    if (boardItem) {
      return (
        <BoardMention
          title={boardItem.title}
          nodeId={nodeId}
          nodeLabel={nodeLabel}
        />
      );
    } else {
      <BoardMention nodeId={undefined} nodeLabel={nodeLabel} />;
    }
  } else {
    return <span>{nodeLabel}</span>;
  }
  return <span>{nodeLabel}</span>;
}
