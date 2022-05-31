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
      className="Lato text-white fontWeight700"
      id={`link-${nodeId}`}
      to={`../wiki/${nodeId}`}
    >
      {title || nodeLabel}
    </Link>
  );
}
