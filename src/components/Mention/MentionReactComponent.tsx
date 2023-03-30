import { useParams } from "react-router-dom";

import BoardMention from "./BoardMention";
import DocumentMention from "./DocumentMention";
import MapMention from "./MapMention";
import WordMention from "./WordMention";

type Props = {
  node: any;
};

export default function MentionReactComponent({ node }: Props) {
  const { project_id } = useParams();

  if (node?.attrs) {
    const { id, name, label, alterId } = node.attrs;
    if (name === "documents")
      return <DocumentMention alterId={alterId} id={id} label={label} project_id={project_id} title={label} />;
    if (name === "maps") return <MapMention nodeId={id} nodeLabel={label} project_id={project_id} />;
    if (name === "boards") return <BoardMention nodeId={id} nodeLabel={label} project_id={project_id} />;
    if (name === "words") return <WordMention id={id} label={label} title={label} />;

    return <span>{label}</span>;
  }
  return <span />;
}
