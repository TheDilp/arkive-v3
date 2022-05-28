import PublicBoardMention from "./PublicBoardMention";
import PublicDocumentMention from "./PublicDocumentMention";
import PublicMapMention from "./PublicMapMention";
type Props = {
  node: any;
};

export default function PublicMentionReactComponent({ node }: Props) {
  let { id: nodeId, name: nodeName, label: nodeLabel } = node.attrs;

  if (nodeName === "at") {
    return (
      <PublicDocumentMention
        title={nodeLabel}
        content={null}
        nodeId={nodeId}
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
