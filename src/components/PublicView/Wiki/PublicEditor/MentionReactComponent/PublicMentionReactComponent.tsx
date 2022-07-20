import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { DocumentProps } from "../../../../../custom-types";
import PublicBoardMention from "./PublicBoardMention";
import PublicDocumentMention from "./PublicDocumentMention";
import PublicMapMention from "./PublicMapMention";
type Props = {
  node: any;
};

export default function PublicMentionReactComponent({ node }: Props) {
  let { id: nodeId, name: nodeName, label: nodeLabel } = node.attrs;
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  if (nodeName === "at") {
    const docs: DocumentProps[] | undefined = queryClient.getQueryData(
      `publicDocuments-${project_id}`
    );
    // Remove the "alter- " part of the id that the mention is using if it has it
    let id = nodeId.replace(/^alter-\d /g, "");
    if (docs) {
      // Find the document with the id and if it exists check if the label name is in alter_names
      // If not, replace it with the main documents title
      let document = docs.find((doc) => doc.id === id);
      if (document) {
        if (document.alter_names && document.alter_names.includes(nodeLabel)) {
          return (
            <PublicDocumentMention
              title={nodeLabel}
              nodeId={id}
              nodeLabel={nodeLabel}
              public={document.public}
            />
          );
        } else {
          return (
            <PublicDocumentMention
              title={document.title}
              nodeId={id}
              nodeLabel={nodeLabel}
              public={document.public}
            />
          );
        }
      }
    }
    return (
      <PublicDocumentMention
        title={nodeLabel}
        nodeId={id}
        nodeLabel={nodeLabel}
      />
    );
  } else if (nodeName === "hash") {
    return <PublicMapMention nodeId={nodeId} nodeLabel={nodeLabel} />;
  } else if (nodeName === "dollah") {
    <PublicBoardMention nodeId={nodeId} nodeLabel={nodeLabel} />;
  } else {
    return <span>{nodeLabel}</span>;
  }
  return <span>{nodeLabel}</span>;
}
