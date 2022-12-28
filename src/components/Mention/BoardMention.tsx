import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type Props = {
  nodeId: string | undefined;
  nodeLabel: string;
  title?: string;
};
export default function BoardMention({ title, nodeId, nodeLabel }: Props) {
  return nodeId ? (
    <Link
      className="inline-flex font-Lato text-sm font-bold text-white transition-colors hover:text-sky-400"
      id={`link-${nodeId}`}
      to={`../../boards/${nodeId}`}>
      <Icon icon="mdi:draw" />
      {title || nodeLabel}
    </Link>
  ) : (
    <div className="Lato text-white">
      <Icon icon="mdi:draw" />
      {nodeLabel}
    </div>
  );
}
