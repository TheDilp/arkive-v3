import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type Props = {
  title?: string;
  nodeId: string | undefined;
  nodeLabel: string;
  project_id: string | undefined;
};
export default function MapMention({ title, nodeId, nodeLabel, project_id }: Props) {
  return nodeId ? (
    <Link
      className="inline-flex font-Lato text-sm font-bold text-white underline transition-colors hover:text-sky-400"
      to={!project_id ? `/view/maps/${nodeId}` : `/project/${project_id}/maps/${nodeId}`}>
      <Icon fontSize={15} icon="mdi:map-marker" />
      {title || nodeLabel}
    </Link>
  ) : (
    <div className="Lato text-white">{nodeLabel}</div>
  );
}
