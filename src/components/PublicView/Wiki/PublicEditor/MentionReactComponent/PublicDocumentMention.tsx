import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";
type Props = {
  title: string;
  content: RemirrorJSON | null;
  nodeId: string | undefined;
  nodeLabel: string;
};
export default function PublicDocumentMention({
  title,
  content,
  nodeId,
  nodeLabel,
}: Props) {
  return (
    <Link
      className="Lato text-white"
      id={`link-${nodeId}`}
      style={{
        fontWeight: "700",
      }}
      to={`../wiki/${nodeId}`}
    >
      {title || nodeLabel}
    </Link>
  );
}
