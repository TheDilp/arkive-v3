import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type Props = {
  nodeId: string | undefined;
  nodeLabel: string;
  title?: string;
  isPublic?: boolean;
  project_id: string;
};
export default function BoardMention({ title, nodeId, nodeLabel, isPublic = true, project_id }: Props) {
  return nodeId ? (
    <Link
      className="inline-flex font-Lato text-sm font-bold text-white underline transition-colors hover:text-sky-400"
      id={`link-${nodeId}`}
      to={isPublic ? `/view/boards/${nodeId}` : `/project/${project_id}/boards/${nodeId}`}>
      <Icon fontSize={15} icon="mdi:draw" />
      {title || nodeLabel}
    </Link>
  ) : (
    <div className="Lato text-white">
      <Icon icon="mdi:draw" />
      {nodeLabel}
    </div>
  );
}
