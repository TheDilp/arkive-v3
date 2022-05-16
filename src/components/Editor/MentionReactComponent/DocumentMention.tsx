import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import { HoverTooltip } from "../LinkHover/HoverTooltip";
import LinkHoverWindow from "../LinkHover/LinkHoverWindow";
type Props = {
  title: string;
  content: RemirrorJSON | null;
  nodeId: string;
  nodeLabel: string;
};
export default function DocumentMention({
  title,
  content,
  nodeId,
  nodeLabel,
}: Props) {
  return (
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
        className={`Lato text-white test`}
        id={`link-${nodeId}`}
        style={{
          fontWeight: "700",
        }}
        to={`../${nodeId}`}
      >
        {title || nodeLabel}
      </Link>
    </HoverTooltip>
  );
}
