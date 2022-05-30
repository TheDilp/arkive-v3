import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import { toastWarn } from "../../../../utils/utils";
import { HoverTooltip } from "../LinkHover/HoverTooltip";
import LinkHoverWindow from "../LinkHover/LinkHoverWindow";
type Props = {
  title: string;
  content: RemirrorJSON | null;
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
    <HoverTooltip
      label={
        <Card
          title={<div className="text-center p-0">{title}</div>}
          className="w-1/3 h-full"
        >
          <LinkHoverWindow content={content} />
        </Card>
      }
    >
      <Link
        className="Lato text-white"
        id={`link-${nodeId}`}
        style={{
          fontWeight: "700",
        }}
        to={`../doc/${nodeId}`}
      >
        {title || nodeLabel}
      </Link>
    </HoverTooltip>
  ) : (
    <span
      className="Lato text-white underline cursor-pointer"
      onClick={() => {
        toastWarn("Document not found.");
      }}
    >
      {title || nodeLabel}
    </span>
  );
}
