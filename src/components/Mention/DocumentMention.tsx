import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import { toaster } from "../../utils/toast";
import { Tooltip } from "../Tooltip/Tooltip";
import LinkHoverWindow from "./MentionHover/MentionHoverWindow";
type Props = {
  title: string;
  content: RemirrorJSON | undefined;
  nodeId: string | undefined;
  nodeLabel: string;
};
export default function DocumentMention({
  title,
  content,
  nodeId,
  nodeLabel,
}: Props) {
  return nodeId ? (
    <Tooltip label={"TEST"}>
      <Link
        className="font-Lato text-white fontWeight700 text-base"
        id={`link-${nodeId}`}
        to={`../doc/${nodeId}`}>
        {title || nodeLabel}
      </Link>
    </Tooltip>
  ) : (
    <span
      className="font-Lato text-white underline cursor-pointer"
      onClick={() => {
        toaster("warning", "Document not found.");
      }}>
      {title || nodeLabel}
    </span>
  );
}
