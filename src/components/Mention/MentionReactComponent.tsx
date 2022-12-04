import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { DocumentType } from "../../types/documentTypes";
import { MapType } from "../../types/mapTypes";
import DocumentMention from "./DocumentMention";
import MapMention from "./MapMention";
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

  const { project_id } = useParams();
  if (node?.attrs) {
    const { id, name, label } = node.attrs;

    if (name === "at") {
      const docs: DocumentType[] | undefined = queryClient.getQueryData(["allItems", project_id, "documents"]);
      const docItem = docs ? docs.find((doc) => doc.id === id.replace(/^alter-\d /g, "")) : undefined;

      if (docItem) {
        let title = "";
        let docId: string = id;

        // Detect if it's an alter_name by checking the id
        // Extract the main documents ID from the node's id if it is
        if (docId.startsWith("alter")) {
          docId = docId.replace(/^alter-\d /g, "");
        }
        // If the item is using an alter name then use it instead of the main document's title
        if (docItem.alter_names && docItem.alter_names.includes(label)) {
          title = label;
        }
        // Otherwise fallback to the doc title
        else {
          title = docItem.title;
        }
        return <DocumentMention content={docItem.content} id={docId} label={label} title={title} />;
      }
      return <DocumentMention content={undefined} id={undefined} label={label} title={label} />;
    }
    if (name === "hash") {
      const maps: MapType[] | undefined = queryClient.getQueryData<MapType[]>(["allItems", project_id, "maps"]);
      const mapItem: MapType | undefined = maps ? maps.find((map) => map.id === id) : undefined;
      if (mapItem) {
        return <MapMention nodeId={id} nodeLabel={label} title={mapItem.title} />;
      }
      return <MapMention nodeId={undefined} nodeLabel={label} />;
    }
    // else if (nodeName === "dollah") {
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

    return <span>{label}</span>;
  }
  return <span />;
}
