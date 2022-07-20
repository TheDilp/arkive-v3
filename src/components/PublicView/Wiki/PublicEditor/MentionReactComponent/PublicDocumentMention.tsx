import { Link } from "react-router-dom";
import { toastWarn } from "../../../../../utils/utils";
type Props = {
  title: string;
  nodeId: string | undefined;
  nodeLabel: string;
  public?: boolean;
};
export default function PublicDocumentMention({
  title,
  nodeId,
  nodeLabel,
  public: publicDocument,
}: Props) {
  return (
    <Link
      className="Lato text-white fontWeight700"
      id={`link-${nodeId}`}
      to={`../wiki/${nodeId}`}
      onClick={(e) => {
        if (!publicDocument) {
          e.preventDefault();
          toastWarn("This page is not public.");
        }
      }}
    >
      {title || nodeLabel}
    </Link>
  );
}
