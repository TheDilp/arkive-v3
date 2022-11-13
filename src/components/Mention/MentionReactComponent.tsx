import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DocumentType } from "../../types/documentTypes";
import DocumentMention from "./DocumentMention";
// import { BoardType } from "../../../../../../types/BoardTypes";
// import { MapProps } from "../../../../../../types/MapTypes";
// import BoardMention from "./BoardMention";
// import DocumentMention from "./DocumentMention";
// import MapMention from "./MapMention";
type Props = {
  node: any;
};

export default function MentionReactComponent({ node }: Props) {
  const queryClient = useQueryClient();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { project_id } = useParams();

  let { id: nodeId, name: nodeName, label: nodeLabel } = node.attrs;

  if (nodeName === "at") {
    const docs: DocumentType[] | undefined = queryClient.getQueryData([
      "allDocuments",
      project_id,
    ]);
    let docItem = docs
      ? docs.find((doc) => doc.id === nodeId.replace(/^alter-\d /g, ""))
      : undefined;

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
          id={id}
          label={nodeLabel}
        />
      );
    } else {
      return (
        <DocumentMention
          title={nodeLabel}
          content={undefined}
          id={undefined}
          label={nodeLabel}
        />
      );
    }
  }
  //   else if (nodeName === "hash") {
  //     const maps: MapProps[] | undefined = queryClient.getQueryData<MapProps[]>(
  //       `${project_id}-maps`,
  //     );
  //     let mapItem: MapProps | undefined = maps
  //       ? maps.find((map) => map.id === nodeId)
  //       : undefined;
  //     if (mapItem) {
  //       return (
  //         <MapMention
  //           title={mapItem.title}
  //           nodeId={nodeId}
  //           nodeLabel={nodeLabel}
  //         />
  //       );
  //     } else {
  //       return <MapMention nodeId={undefined} nodeLabel={nodeLabel} />;
  //     }
  //   } else if (nodeName === "dollah") {
  //     const boards: BoardType[] | undefined = queryClient.getQueryData<
  //       BoardType[]
  //     >(`${project_id}-boards`);
  //     let boardItem = boards
  //       ? boards.find((board) => board.id === nodeId)
  //       : undefined;
  //     if (boardItem) {
  //       return (
  //         <BoardMention
  //           title={boardItem.title}
  //           nodeId={nodeId}
  //           nodeLabel={nodeLabel}
  //         />
  //       );
  //     } else {
  //       <BoardMention nodeId={undefined} nodeLabel={nodeLabel} />;
  //     }
  //   }
  else {
    return <span>{nodeLabel}</span>;
  }
  return <span>{nodeLabel}</span>;
}
